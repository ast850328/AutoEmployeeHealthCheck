import * as log4js from 'log4js';
import puppeteer from 'puppeteer';

import { sendBotMessage } from './bot';

const logger = log4js.getLogger('crawler');

function _getRandom(): number {
  return Math.floor((Math.random() + 36) * 10) / 10;
}

async function crawlWeb(url: string, workerNumber: string) {
  logger.info(`Start to auto health check ${workerNumber}`);

  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.goto(url);

  // agree button
  await page.click('input[id="655521227_4306656654"]');
  // worker number
  await page.type('input[id="655521224"]', workerNumber);
  // temperature method
  await page.click('input[id="655521229_4306656659"]');
  // temperature
  const temperature = _getRandom().toString();
  await page.type('input[id="655521225"]', temperature);
  // close contacted people
  await page.click('input[id="655521234_4306656687"]');
  // broadcast messaging
  await page.click('input[id="655521350_4306658113"]');
  // declaration
  await page.click('input[id="655521226_4306656644"]');

  await page.click('button[type=submit]');

  await page.waitForNavigation();

  logger.info('Worker Number: ', workerNumber);
  logger.info('Temperature: ', temperature);

  let isSucceed = false;
  if (page.url().includes('HCCompleted')) {
    logger.info(`Completed worker number: ${workerNumber}`);
    isSucceed = true;
  } else {
    logger.info(`Failed worker number: ${workerNumber}`);
  }

  sendBotMessage(workerNumber, temperature, isSucceed);

  await browser.close();
}

export { crawlWeb };
