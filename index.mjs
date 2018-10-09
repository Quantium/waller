import {UrlGetter} from './src/UrlGetter';
import {MongoConn} from './src/MongoConn';
const website = 'https://wallpaperscraft.com/download/black_apple_bones_skull_26511/1440x900';
const conn = new MongoConn();
const getter = new UrlGetter(website,'base');

async function init(){
  await conn.connect();
  let list = await getter.crawl().catch((err)=>{
    console.error(err);
  });

  let raw  = [];
  for (let l of list) {
    raw.push({url:l,created: new Date().getTime()});
  }
  conn.db.collection('urls').insertMany(raw, function(err, r) {
    //console.error("BulkWriteError");
  });

}
init();
