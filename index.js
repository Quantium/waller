/*jshint esversion: 6 */
const puppeteer = require('puppeteer');
const website = 'https://wallpaperscraft.com/download/black_apple_bones_skull_26511/1440x900';
console.log(puppeteer);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(website, {waitUntil: 'networkidle2'});
  await page.screenshot({path: 'img.png'});

  await browser.close();
})();
