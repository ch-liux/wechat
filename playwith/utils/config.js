let https = 'http://127.0.0.1:8000';
let artUrl = https + '/api/art/';
let bannerUrl = https + '/api/banner/';
let adviceUrl = https + '/api/advice/';
let browseUrl = https + '/browse/';

let oss = {
  "key": "xxx",
  "policy": "xxxx",
  "signature": "xxxx",
  "url": "xxxx",
  "path": "withplay/art/"
}

// const a = (b)=>{
//   return b+b;
// }
module.exports = {
  'artUrl': artUrl,
  'bannerUrl': bannerUrl,
  'adviceUrl': adviceUrl,
  'browseUrl': browseUrl,
  'oss': oss
}