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
  await page.click('input[id="658750779_4327847677"]');
  // worker number
  await page.type('input[id="658750776"]', workerNumber);
  // temperature method
  await page.click('input[id="658750781_4327847680"]');
  // temperature
  const temperature = _getRandom().toString();
  await page.type('input[id="658750777"]', temperature);
  // close contacted people
  await page.click('input[id="658750786_4327847704"]');
  // broadcast messaging
  await page.click('input[id="658750787_4327847706"]');
  // accepted the PCR nucleic acid test or got the positive of COVID-19 rapid test
  await page.click('input[id="658750788_4327847708"]');
  // declaration
  await page.click('input[id="658750778_4327847669"]');

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
