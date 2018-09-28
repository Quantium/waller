/*jshint esversion: 6 */
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://quantium.com.mx');
  await page.screenshot({
    path: 'example.png'
  });

  await browser.close();
})();
