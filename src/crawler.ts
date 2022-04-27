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
  await page.click('input[id="66405067_542650090"]');
  // worker number
  await page.type('input[id="66405064"]', workerNumber);
  // temperature method
  await page.click('input[id="66405069_542650093"]');
  // temperature
  const temperature = _getRandom().toString();
  await page.type('input[id="66405065"]', temperature);
  //Symptoms
  await page.click('input[id="66405075_542650132"]');
  // situations
  await page.click('input[id="66405078_542650167"]');
  // COVID-19 confirmed case
  await page.click('input[id="66405074_542650161"]');
  //  got vaccinated
  await page.click('input[id="66405076_542650156"]');
  // declaration
  await page.click('input[id="66405066_542650082"]');
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
