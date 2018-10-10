import {UrlGetter} from './src/UrlGetter';
import {MongoConn} from './src/MongoConn';

import cluster from 'cluster';
import http from 'http';
import os from 'os'

import fs from 'fs';
import request from 'request';

const numCPUs = os.cpus().length;

const ini_url = 'https://wallpaperscraft.com/download/black_apple_bones_skull_26511/1440x900'


if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  //for (let i = 0; i < numCPUs; i++) {
  for (let i = 0; i < 1; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });

  init(ini_url);
} else {
  console.log(`Worker ${process.pid} started`);
  downloadNext()
  .then((res)=>{
    downloadNext();
  })
  .catch((err)=>{
    console.error(err);
  })

}

//------------------------------------------------------------------------init()
async function init(website){
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
    //console.log(">",l);
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
//----------------------------------------------------------------downloadNext()
async function downloadNext(){
  let getter = await new UrlGetter(ini_url);
  let conn = new MongoConn();
  await conn.connect();
  let urls = conn.db.collection('urls');
  var imageUrl = "";

  //Finding next image to download
  await urls.findOne({"downloaded":{$exists:false}}, async (err, document)=>{
    if (err) { console.warn(err); }
    if (document == null) {
      console.warn("All the images were already downloaded");
      getter.close();
      conn.close();
      cluster.worker.disconnect();
      return;
    }
    //Calling getter.download() with the obtained document
    imageUrl = await getter.download(document.url);
    //Downloading file
    await request.head(imageUrl, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);

      let wpImg = 'img'+Math.floor(Math.random()*10000).toString()+'.'+imageUrl.substring(imageUrl.length - 3);

      request(imageUrl).pipe(fs.createWriteStream(wpImg).on('close', ()=>{
        console.log('Downloaded::',wpImg);
        urls.findOneAndUpdate({"url": document.url}, {$set: {"downloaded": wpImg}},  function(err,doc) {
             if (err) { throw err; }
        });
      }));
    });

  });

}
