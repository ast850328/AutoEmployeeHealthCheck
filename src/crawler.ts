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

  // first page
  // agree button
  await page.click('input[id="670913045_4407790167"]');
  // worker number
  await page.type('input[id="670913042"]', workerNumber);
  // temperature method
  await page.click('input[id="670913047_4407790170"]');
  // temperature
  const temperature = _getRandom().toString();
  await page.type('input[id="670913043"]', temperature);
  // high risk person
  await page.click('input[id="670913052_4407790194"]');
  // symptoms of COVID-19 in the past 7 days
  await page.click('input[id="670913053_4407790195"]');
  // high risk hot spot
  await page.click('input[id="670913055_4407790215"]');
  // next page
  await page.click('button[type=submit]');

  await page.waitForNavigation();

  // second page
  // accepted the PCR nucleic acid test
  await page.click('input[id="670913054_4407790198"]');
  // last rapid test result in 7 days
  await page.click('input[id="670917501_4407848014"]');
  // declaration
  await page.click('input[id="670913044_4407790159"]');
  // next page
  await page.click('button.btn.small.next-button.survey-page-button.user-generated.notranslate');

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
