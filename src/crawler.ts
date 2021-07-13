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
  await page.click('input[id="680221512_4471599931"]');
  // worker number
  await page.type('input[id="680221509"]', workerNumber);
  // temperature method
  await page.click('input[id="680221514_4471599934"]');
  // temperature
  const temperature = _getRandom().toString();
  await page.type('input[id="680221510"]', temperature);
  //Symptoms
  await page.click('input[id="680226629_4471632716"]');
  // high risk person
  await page.click('input[id="680221519_4471599958"]');
  // symptoms of COVID-19 in the past 7 days
  await page.click('input[id="680221520_4471599959"]');
  // overlap with the confirmed person’s footprint
  await page.click('input[id="680221524_4471600012"]');
  // accepted the PCR nucleic acid test
  await page.click('input[id="680221521_4471599962"]');
  // last rapid test result in 7 days
  await page.click('input[id="680221523_4471600005"]');
  // declaration
  await page.click('input[id="680221511_4471599923"]');
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
