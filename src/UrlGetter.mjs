"use strict";
import puppeteer from 'puppeteer';
export class UrlGetter {

  constructor(website){
    this._url = website;

  }
  get list(){
    if(this._list == null){
      this._list = [];
    }
    return this._list;
  }

  async crawl(){
    if(this._browser == undefined){
      this._browser = await puppeteer.launch();
    }
    let page = await this._browser.newPage();
    await page.goto(this._url, {waitUntil: 'networkidle2'});

    let wallpapers = await page.$$('.wallpapers__link');

    let texts = await page.evaluate(() => {
        return [...document.body.querySelectorAll('.wallpapers__link')]
                 .map(element => element.href);
      });
    this._list = texts;
    return texts;

  }
  async close(){
    this._browser.close();
    console.log('Navigator Closed')
  }
}
