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
  await page.click('input[id="664916255_4368333336"]');
  // worker number
  await page.type('input[id="664916252"]', workerNumber);
  // temperature method
  await page.click('input[id="664916257_4368333339"]');
  // temperature
  const temperature = _getRandom().toString();
  await page.type('input[id="664916253"]', temperature);
  // close contacted people
  await page.click('input[id="664916262_4368333363"]');
  // you or your cohabitants(including non-daily living together) sought medical care
  await page.click('input[id="664916263_4368333364"]');
  // accepted the PCR nucleic acid test or got the positive of COVID-19 rapid test
  await page.click('input[id="664916264_4368333367"]');
  // stayed in any indoor place for more than 2 hours in Taipei city or New Taipei city in the past 14 days?
  await page.click('input[id="664916265_4368333384"]');
  // stayed in any indoor place for more than 2 hours in Miaoli city in the past 14 days?
  await page.click('input[id="664916315_4368333807"]');
  // declaration
  await page.click('input[id="664916254_4368333328"]');

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
