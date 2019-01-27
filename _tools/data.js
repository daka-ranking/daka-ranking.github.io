var crawler = require('./crawler');
var fs = require('fs');
var _ = require('lodash');
var config = require('./config');

async function contest_data_raw(slug) {
  var fname = `${__dirname}/raw/${slug}.json`;
  var exists = fs.existsSync(fname);
  if (!exists) {
    var cont = await crawler.fetch_contest(slug);
    fs.writeFileSync(fname, JSON.stringify(cont, null, 2), 'utf-8');
  }
  return JSON.parse(fs.readFileSync(fname, 'utf-8'));
}

function convert(raw, users) {
  var questions = raw.questions;

  var userById = _.keyBy(users, 'id');
  var records = [];
  for (var i = 0; i < raw.total_rank.length; ++i) {
    if (!(raw.total_rank[i].username in userById)) {
      continue;
    }

    var rank = raw.total_rank[i];
    var submissions = raw.submissions[i];
    var solved = questions.map(q => !!submissions[q.question_id]);

    records.push({
      id: raw.total_rank[i].username,
      ranking: rank.rank,
      solved: solved,
    });
  }

  return {
    questions,
    records,
    players : raw.user_num,
  };
}

exports.contest_data = async function contest_data(slug) {
  var fname = `${__dirname}/data/${slug}.json`;
  var exists = fs.existsSync(fname);
  if (!exists) {
    var raw = await contest_data_raw(slug);
    cont = convert(raw, config.members);
    fs.writeFileSync(fname, JSON.stringify(cont, null, 2), 'utf-8');
  }
  return JSON.parse(fs.readFileSync(fname, 'utf-8'));
}

async function test() {
  var c1 = await contest_data('weekly-contest-121');
  var c2 = await contest_data('weekly-contest-120');
  var c3 = await contest_data('weekly-contest-119');
  var c4 = await contest_data('weekly-contest-118');
  var d = merge([c1,c2], config.members);
  //console.log(raw.total_rank[1001]);
  //console.log(raw.submissions[1001]);
}

//test().catch(console.error);
