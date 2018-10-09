"use strict";
import mongodb from 'mongodb';
export class MongoConn {
  constructor(host = '192.168.8.100'){
    this._host = 'mongodb://'+ host +':27017/URLGetter';
    this._client = new mongodb.MongoClient(this._host,{ useNewUrlParser: true });
  }
  get db(){
    if(this._db == undefined){
      return "empty";
    }
    return this._db;
  }
  async connect(){
    await this._client.connect().catch((err)=>{
      console.error(err);
    })
    this._db = await this._client.db('URLGetter');
  }
  async close(){
    return this._client.close()
    .catch((err)=>{
      console.error(err);
    })
  }
}
