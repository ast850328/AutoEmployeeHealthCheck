import { CronJob } from 'cron';
import * as log4js from 'log4js';
import * as dotenv from 'dotenv';

import { crawlWeb } from './crawler';

log4js.configure({
  appenders: { crawler: { type: 'file', filename: 'crawler.log' } },
  categories: { default: { appenders: ['crawler'], level: 'info' } },
});
const logger = log4js.getLogger('crawler');

dotenv.config();
const url: string = process.env.URL ? process.env.URL : '';
const cronTime: string = process.env.CRON_TIME ? process.env.CRON_TIME : '* * * * * *';
const workerNumbers: Array<string> = process.env.WORKER_NUMBER ? process.env.WORKER_NUMBER?.split(',') : [''];

const job = new CronJob(cronTime, () => {
  logger.info('start job');
  workerNumbers.forEach((workerNumber) => {
    crawlWeb(url, workerNumber);
  });
}, null, true, 'Asia/Taipei');

job.start();