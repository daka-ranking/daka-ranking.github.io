var fetch = require('node-fetch-retry');
var mapLimit = require('promise-map-limit');

var LC_URL = 'https://leetcode.com';

exports.fetch_contests = async function() {
  var body = {
    operationName: null,
    variables: {},
    query: '{allContests{title titleSlug}}',
  };
  var res = await fetch(LC_URL + '/graphql', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  var json = await res.json();
  return json.data.allContests;
};

async function fetch_contest_page(slug, page) {
  var url = LC_URL + '/contest/api/ranking/' + slug +
              '/?pagination=' + page + '&region=global';
  var res = await fetch(url, { retry: 3 });
  var json = await res.json();
  console.log(`${slug}: fetched page ${page}`);
  return json;
}

exports.fetch_contest = async function(slug) {
  var page1 = await fetch_contest_page(slug, 1);
  if (!page1.total_rank)
    return;
  var npage = Math.ceil(page1.user_num / page1.total_rank.length);

  var tasks = new Array(npage - 1).fill().map((x,i) => i+2);
  var pages = await mapLimit(tasks, 5, page => fetch_contest_page(slug, page));
  pages.unshift(page1);

  var submissions = [];
  var total_rank = [];
  for (var i = 0; i < pages.length; ++i) {
    submissions = submissions.concat(pages[i].submissions);
    total_rank = total_rank.concat(pages[i].total_rank);
  }

  page1.submissions = submissions;
  page1.total_rank = total_rank;
  return page1;
};

async function test() {
  var contests = await exports.fetch_contests();
  var x = await exports.fetch_contest(contests[0].titleSlug);
  console.log(x);
}

// test().then(console.log, console.log);
