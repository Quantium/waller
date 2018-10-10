import {UrlGetter} from './src/UrlGetter';
import {MongoConn} from './src/MongoConn';


async function init(website){
  console.log("init",website);
  let getter = await new UrlGetter(website);
  let conn = new MongoConn();
  await conn.connect();
  let urls = conn.db.collection('urls');
  urls.findOneAndUpdate({"url": website}, {$set: {"processed": true}},  function(err,doc) {
       if (err) { throw err; }
     });

  let list = await getter.crawl();

  let raw  = [];
  for (let l of list) {
    console.log(">",l);
    raw.push({url:l,created: new Date().getTime()});

  }

  if(list.length == 0){
    console.warn("There are no links to be processed");
    await getter.close();
    await conn.close();
    return;
  }
  urls.insertMany(raw, function(err, r) {
    //If the error type is a BulkWriteError, then the url is reapeated in the database
    console.info("BulkWriteError");
  });

  await urls.findOne({"processed":{$exists:false}}, function(err, document) {
    if (err) { console.warn(err); }
    if (document == null) {
      console.warn("All the records were processed");
      getter.close();
      conn.close();
      return;
    }
    init(document.url);
  });

  await getter.close();
  await conn.close();
}
init('https://wallpaperscraft.com/download/black_apple_bones_skull_26511/1440x900');
