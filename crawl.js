const HCCrawler = require('headless-chrome-crawler');
const CSVExporter = require('headless-chrome-crawler/exporter/csv');

const FILE = 'result.csv';

const exporter = new CSVExporter({
  file: FILE,
  fields: ['response.url', 'response.status', 'links.length'],
});

(async () => {
  const crawler = await HCCrawler.launch({
    maxDepth: 2,
    exporter,
  });
  await crawler.queue('https://wallpaperscraft.com/download/black_apple_bones_skull_26511/1440x900');
  await crawler.onIdle();
  await crawler.close();
})();
