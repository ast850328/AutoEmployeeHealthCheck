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
  await page.click('input[id="755896121_4987465614"]');
  // worker number
  await page.type('input[id="755896118"]', workerNumber);
  // temperature method
  await page.click('input[id="755896123_4987465617"]');
  // temperature
  const temperature = _getRandom().toString();
  await page.type('input[id="755896119"]', temperature);
  //Symptoms
  await page.click('input[id="755896129_4987465656"]');
  // update the health declaration form
  await page.click('input[id="755896128_4987494302"]');
  //  got vaccinated
  await page.click('input[id="755896130_4987465680"]');
  // declaration
  await page.click('input[id="755896120_4987465606"]');
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
