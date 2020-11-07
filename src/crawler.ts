import * as log4js from 'log4js';
import puppeteer from 'puppeteer';

import { sendBotMessage } from './bot';

const logger = log4js.getLogger('crawler');

function _getRandom(): number {
  return Math.floor((Math.random() + 36) * 10) / 10;
}

async function crawlWeb(url: string, workerNumber: string) {
  const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
  const page = await browser.newPage();
  await page.goto(url);

  // agree button
  await page.click('input[id="486014833_3209788694"]');
  // worker number
  await page.type('input[id="486014830"]', workerNumber);
  // temperature measurement method
  await page.click('input[id="486014835_3209788699"]');
  // random temperature 36 ~ 38
  const temperature = _getRandom().toString();
  await page.type('input[id="486014831"]', temperature);
  // close contacted people
  await page.click('input[id="486015076_3209796414"]');
  // declaration
  await page.click('input[id="486014832_3209788684"]');

  await page.click('button[type=submit]');

  await page.waitForNavigation();

  logger.info('Worker Number: ', workerNumber);
  logger.info('Temperature : ', temperature);

  let isSucceed = false;
  if (page.url().includes('HCCompleted')) {
    logger.info('Auto employee health check completed!');
    isSucceed = true;
  } else {
    logger.info('Auto employee health check failed!');
  }

  sendBotMessage(workerNumber, temperature, isSucceed);
  
  await browser.close();
}

export { crawlWeb };
