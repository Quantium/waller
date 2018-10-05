"use strict";
import puppeteer from 'puppeteer';
export class UrlGetter {

  constructor(website,database=''){
    this._url = website;
    this._database = database;
    console.log(`URLGetter(${website},${database})`)

    this._list = this.crawl();


  }
  get list(){
    if(this._list == null){
      this._list = [];
    }
    return this._list;
  }

  chocho(){
    console.log('Chocho');
  }

  async crawl(){
    this._browser = await puppeteer.launch();
    let page = await this._browser.newPage();
    await page.goto(this._url, {waitUntil: 'networkidle2'});
    await page.screenshot({path: 'img.png'});
    const allResultsSelector = '.gui-button_full-height';
    //await page.waitForSelector(allResultsSelector);
    page.click(allResultsSelector);
    console.log('clicked');
    await page.waitForNavigation({waitUntil:'networkidle2'});
    console.log('networkidle2');
    await page.screenshot({path: 'img2.png'});
    console.log('screenshot 2');
    await page.goBack({waitUntil:'networkidle2'});
    console.log('Going back');
    await page.screenshot({path: 'img3.png'});
    console.log('screenshot 3');

    const wallpapers = await page.$$('.wallpapers__link');
    console.log(wallpapers.length)

    const texts = await page.evaluate(() => {
        return [...document.body.querySelectorAll('.wallpapers__link')]
                 .map(element => element.href);
      });
    //await this.close();
    return texts;

  }
  async close(){
    await this._browser.close();
    console.log('closed')
  }
}
