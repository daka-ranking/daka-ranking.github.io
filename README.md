# lc打卡群积分榜

## 使用说明

### 首次使用

```
$ git clone https://github.com/daka-ranking/daka-ranking.github.io
$ cd daka-ranking.github.io/_tools
$ npm i
```

### 更新积分

```
$ cd _tools
$ node update
```

### 更新成员

编辑_tools/config.js

### 手工修改单词结果

先运行一次更新，在手动编辑 _tools/data/xxx.json 即可。然后再update一次即可。

### 更新页面

update后，将文件入库，然后推送即可。
