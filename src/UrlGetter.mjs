"use strict";
import puppeteer from 'puppeteer';
export class UrlGetter {

  constructor(website,database=''){
    this._url = website;
    this._database = database;

  }
  get list(){
    if(this._list == null){
      this._list = [];
    }
    return this._list;
  }

  async crawl(){
    this._browser = await puppeteer.launch();
    let page = await this._browser.newPage();
    await page.goto(this._url, {waitUntil: 'networkidle2'});

    const texts = await page.evaluate(() => {
        return [...document.body.querySelectorAll('.wallpapers__link')]
                 .map(element => element.href);
      });
    this._list = texts;
    return texts;

  }
  async close(){
    this._browser.close();
    //console.log('closed')
  }
}
