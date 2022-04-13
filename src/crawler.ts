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
  await page.click('input[id="62391608_516129376"]');
  // worker number
  await page.type('input[id="62391605"]', workerNumber);
  // temperature method
  await page.click('input[id="62391610_516129379"]');
  // temperature
  const temperature = _getRandom().toString();
  await page.type('input[id="62391606"]', temperature);
  //Symptoms
  await page.click('input[id="62391616_516129418"]');
  // COVID-19 rapid test
  await page.click('input[id="62391993_525542511"]');
  // COVID-19 confirmed case
  await page.click('input[id="62391615_516129447"]');
  //  got vaccinated
  await page.click('input[id="62391617_516129442"]');
  // declaration
  await page.click('input[id="62391607_516129368"]');
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
