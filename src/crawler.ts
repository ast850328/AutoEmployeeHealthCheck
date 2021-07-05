import * as log4js from "log4js";
import puppeteer from "puppeteer";

import { sendBotMessage } from "./bot";

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

  // first page
  // agree button
  await page.click('input[id="677104488_4450212741"]');
  // worker number
  await page.type('input[id="677104485"]', workerNumber);
  // temperature method
  await page.click('input[id="677104490_4450212744"]');
  // temperature
  const temperature = _getRandom().toString();
  await page.type('input[id="677104486"]', temperature);
  // high risk person
  await page.click('input[id="677104495_4450212768"]');
  // symptoms of COVID-19 in the past 7 days
  await page.click('input[id="677104496_4450212769"]');
  // overlap with the confirmed person’s footprint
  await page.click('input[id="677104701_4450214118"]');
  // high risk hot spot
  await page.click('input[id="677104498_4450212787"]');
  // next page
  await page.click("button[type=submit]");

  await page.waitForNavigation();

  // second page
  // accepted the PCR nucleic acid test
  await page.click('input[id="677104497_4450212772"]');
  // last rapid test result in 7 days
  await page.click('input[id="677104501_4450212839"]');
  // declaration
  await page.click('input[id="677104487_4450212733"]');
  // next page
  await page.click(
    "button.btn.small.next-button.survey-page-button.user-generated.notranslate"
  );

  await page.waitForNavigation();

  logger.info("Worker Number: ", workerNumber);
  logger.info("Temperature: ", temperature);

  let isSucceed = false;
  if (page.url().includes("HCCompleted")) {
    logger.info(`Completed worker number: ${workerNumber}`);
    isSucceed = true;
  } else {
    logger.info(`Failed worker number: ${workerNumber}`);
  }

  sendBotMessage(workerNumber, temperature, isSucceed);

  await browser.close();
}

export { crawlWeb };
