
const puppeteer = require('puppeteer');
const website = 'https://wallpaperscraft.com/download/black_apple_bones_skull_26511/1440x900';
console.log('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  //const browser = await puppeteer.launch({executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'});
  const context = browser.createIncognitoBrowserContext();
  const page = await browser.newPage();
  console.log('page');
  await page.goto(website, {waitUntil: 'networkidle2'});
  console.log('networkidle2')
  await page.screenshot({path: 'img.png'});
  console.log('screenshot 1');

  // Type into search box.
  //await page.type('#searchbox input', 'Headless Chrome');

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
/*
  for(let wl in wallpapers){
    console.log('-------------------------\n\n\n\n\n\n\n\n\n\n\n\n\n--------------------------')
    //console.log(await wallpapers[wl].href);
    console.log(document.querySelector(wallpapers[wl]).href);
  }
  */

  const texts = await page.evaluate(() => {
      return [...document.body.querySelectorAll('.wallpapers__link')]
               .map(element => element.href);
    });
  console.log(texts);
  // Wait for the results page to load and display the results.
  //const resultsSelector = '.gsc-results .gsc-thumbnail-inside a.gs-title';
  //await page.waitForSelector(resultsSelector);

  // Extract the results from the page.
  //const links = await page.evaluate(resultsSelector => {
  //  const anchors = Array.from(document.querySelectorAll(resultsSelector));
  //  return anchors.map(anchor => {
  //    const title = anchor.textContent.split('|')[0].trim();
  //    return `${title} - ${anchor.href}`;
  //  });
  //}, resultsSelector);
  //console.log(links.join('\n'));

  await browser.close();
  console.log('closed')
})();
