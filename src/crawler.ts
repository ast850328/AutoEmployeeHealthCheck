import * as log4js from "log4js";
import puppeteer from "puppeteer";

const logger = log4js.getLogger("crawler");

function _getRandom(): number {
  return Math.floor((Math.random() + 36) * 10) / 10;
}

async function crawlWeb(url: string, workerNumber: string) {
  logger.info(`Start to auto health check ${workerNumber}`);

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url);

  // agree button
  await page.click('input[id="748706227_4926034976"]');
  // worker number
  await page.type('input[id="748706224"]', workerNumber);
  // temperature method
  await page.click('input[id="748706229_4926034979"]');
  // temperature
  const temperature = _getRandom().toString();
  await page.type('input[id="748706225"]', temperature);
  //Symptoms
  await page.click('input[id="748706235_4926035018"]');
  // update the health declaration form
  await page.click('input[id="748706234_4926035003"]');
  //  got vaccinated
  await page.click('input[id="748706236_4926035042"]');
  // air port
  await page.click('input[id="748706328_4926038299"]');
  // declaration
  await page.click('input[id="748706226_4926034968"]');
  // submit
  await page.click("button[type=submit]");

  await page.waitForNavigation();

  logger.info("Worker Number: ", workerNumber);
  logger.info("Temperature: ", temperature);

  const completedUrl: string = page.url();
  await browser.close();

  if (!completedUrl.includes("HCCompleted")) {
    Promise.reject();
  }
  Promise.resolve();
}

export { crawlWeb };
