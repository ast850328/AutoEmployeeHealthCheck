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
  await page.click('input[id="660768081_4340945613"]');
  // worker number
  await page.type('input[id="660768078"]', workerNumber);
  // temperature method
  await page.click('input[id="660768083_4340945616"]');
  // temperature
  const temperature = _getRandom().toString();
  await page.type('input[id="660768079"]', temperature);
  // close contacted people
  await page.click('input[id="660768088_4340945640"]');
  // broadcast messaging
  await page.click('input[id="660768089_4340945642"]');
  // accepted the PCR nucleic acid test or got the positive of COVID-19 rapid test
  await page.click('input[id="660768090_4340945644"]');
  // stayed in any indoor place for more than 2 hours in Taipei city or New Taipei city in the past 14 days?
  await page.click('input[id="660769069_4340992401"]');
  // declaration
  await page.click('input[id="660768080_4340945605"]');

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
