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
  await page.click('input[id="715032623_4702730653"]');
  // worker number
  await page.type('input[id="715032620"]', workerNumber);
  // temperature method
  await page.click('input[id="715032625_4702730656"]');
  // temperature
  const temperature = _getRandom().toString();
  await page.type('input[id="715032621"]', temperature);
  //Symptoms
  await page.click('input[id="715032636_4702730736"]');
  // update the health declaration form
  await page.click('input[id="715032630_4702730680"]');
  //  got vaccinated
  await page.click('input[id="715032637_4702730769"]');
  // declaration
  await page.click('input[id="715032622_4702730645"]');
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
