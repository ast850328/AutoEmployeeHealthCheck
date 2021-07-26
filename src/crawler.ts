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
  await page.click('input[id="683674386_4495696088"]');
  // worker number
  await page.type('input[id="683674383"]', workerNumber);
  // temperature method
  await page.click('input[id="683674388_4495696091"]');
  // temperature
  const temperature = _getRandom().toString();
  await page.type('input[id="683674384"]', temperature);
  //Symptoms
  await page.click('input[id="683674400_4495696174"]');
  // high risk person
  await page.click('input[id="683674393_4495696115"]');
  //  got vaccinated
  await page.click('input[id="683711504_4495952679"]');
  // symptoms of COVID-19 in the past 7 days
  await page.click('input[id="683674394_4495717677"]');
  // overlap with the confirmed person’s footprint
  await page.click('input[id="683674398_4495718982"]');
  // accepted the PCR nucleic acid test
  await page.click('input[id="683674395_4495696119"]');
  // last rapid test result in 7 days
  await page.click('input[id="683674397_4495696166"]');
  // declaration
  await page.click('input[id="683674385_4495696080"]');
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
