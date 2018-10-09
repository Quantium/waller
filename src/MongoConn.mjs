"use strict";
import mongodb from 'mongodb';
export class MongoConn {
  constructor(host = '192.168.8.100'){
    this._client = new mongodb.MongoClient('mongodb://'+ host +':27017');
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
}
