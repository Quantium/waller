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
    this._browser = await puppeteer.launch();
    let page = await this._browser.newPage();
    await page.goto(this._url, {waitUntil: 'networkidle2'});
    //const allResultsSelector = '.gui-button_full-height';
    //page.click(allResultsSelector);
    //await page.waitForNavigation({waitUntil:'networkidle2'});
    //await page.goBack({waitUntil:'networkidle2'});

    const wallpapers = await page.$$('.wallpapers__link');

    const texts = await page.evaluate(() => {
        return [...document.body.querySelectorAll('.wallpapers__link')]
                 .map(element => element.href);
      });
    this._list = texts;
    return texts;

  }
  async close(){
    this._browser.close();
    console.log('closed')
  }
}
