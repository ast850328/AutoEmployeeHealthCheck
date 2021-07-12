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
  await page.click('input[id="679468817_4466173239"]');
  // worker number
  await page.type('input[id="679468814"]', workerNumber);
  // temperature method
  await page.click('input[id="679468819_4466173242"]');
  // temperature
  const temperature = _getRandom().toString();
  await page.type('input[id="679468815"]', temperature);
  // high risk person
  await page.click('input[id="679468824_4466173266"]');
  // symptoms of COVID-19 in the past 7 days
  await page.click('input[id="679468825_4466173267"]');
  // overlap with the confirmed person’s footprint
  await page.click('input[id="679468831_4466173346"]');
  // accepted the PCR nucleic acid test
  await page.click('input[id="679468826_4466173270"]');
  // last rapid test result in 7 days
  await page.click('input[id="679468830_4466173337"]');
  // declaration
  await page.click('input[id="679468816_4466173231"]');
  // next page
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
