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
  await page.click('input[id="656236653_4311183173"]');
  // worker number
  await page.type('input[id="656236650"]', workerNumber);
  // temperature method
  await page.click('input[id="656236655_4311183178"]');
  // temperature
  const temperature = _getRandom().toString();
  await page.type('input[id="656236651"]', temperature);
  // close contacted people
  await page.click('input[id="656236660_4311183206"]');
  // broadcast messaging
  await page.click('input[id="656236661_4311183210"]');
  // stay in Wanhua
  await page.click('input[id="656236965_4311185198"]');
  // declaration
  await page.click('input[id="656236652_4311183163"]');

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
