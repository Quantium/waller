import {UrlGetter} from './src/UrlGetter';
import {MongoConn} from './src/MongoConn';


async function init(website){
  console.log("init",website);
  let getter = await new UrlGetter(website);
  let conn = new MongoConn();
  await conn.connect();
  let list = await getter.crawl();

  let raw  = [];
  for (let l of list) {
    console.log(">",l);
    raw.push({url:l,created: new Date().getTime()});

  }
  conn.db.collection('urls').insertMany(raw, function(err, r) {
    //If the error type is a BulkWriteError, then the url is reapeated in the database
    console.error("BulkWriteError");
  });
  await getter.close();
  await conn.close();
  init(list[0]);


}
init('https://wallpaperscraft.com/download/black_apple_bones_skull_26511/1440x900');
