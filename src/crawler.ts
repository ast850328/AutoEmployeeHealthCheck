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
  await page.click('input[id="647719974_4255613818"]');
  // worker number
  await page.type('input[id="647719971"]', workerNumber);
  // temperature
  await page.click('input[id="647719976_4255613822"]');
  // close contacted people
  await page.click('input[id="647719981_4255613851"]');
  // declaration
  await page.click('input[id="647719973_4255613808"]');

  await page.click('button[type=submit]');

  await page.waitForNavigation();

  logger.info('Worker Number: ', workerNumber);

  let isSucceed = false;
  if (page.url().includes('HCCompleted')) {
    logger.info('Auto employee health check completed!');
    logger.info(`Completed worker number: ${workerNumber}`);
    isSucceed = true;
  } else {
    logger.info('Auto employee health check failed!');
    logger.info(`Failed worker number: ${workerNumber}`);
  }

  sendBotMessage(workerNumber, isSucceed);

  await browser.close();
}

export { crawlWeb };
