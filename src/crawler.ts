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
  await page.click('input[id="763128017_5051449824"]');
  // worker number
  await page.type('input[id="763128014"]', workerNumber);
  // temperature method
  await page.click('input[id="763128019_5051449827"]');
  // temperature
  const temperature = _getRandom().toString();
  await page.type('input[id="763128015"]', temperature);
  //Symptoms
  await page.click('input[id="763128025_5051449866"]');
  // update the health declaration form
  await page.click('input[id="763128024_5051449895"]');
  //  got vaccinated
  await page.click('input[id="763128026_5051449890"]');
  // declaration
  await page.click('input[id="763128016_5051449816"]');
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
