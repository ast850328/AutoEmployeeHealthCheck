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
  await page.click('input[id="659398437_4331991557"]');
  // worker number
  await page.type('input[id="659398434"]', workerNumber);
  // temperature method
  await page.click('input[id="659398439_4331991560"]');
  // temperature
  const temperature = _getRandom().toString();
  await page.type('input[id="659398435"]', temperature);
  // close contacted people
  await page.click('input[id="659398444_4331991584"]');
  // broadcast messaging
  await page.click('input[id="659398445_4331991586"]');
  // accepted the PCR nucleic acid test or got the positive of COVID-19 rapid test
  await page.click('input[id="659398446_4331991588"]');
  // declaration
  await page.click('input[id="659398436_4331991549"]');

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
