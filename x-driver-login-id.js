// const puppeteer = require('puppeteer'); // v20.7.4 or later
import puppeteer from 'puppeteer';
import { xLoginPassword } from './data/x-login.js';
import { sleep } from './utils.js';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const timeout = 25000;

  console.log('start');
  page.setDefaultTimeout(timeout);

  const targetPage = page;
  await targetPage.setViewport({
    width: 885,
    height: 754,
  });
  await targetPage.goto('chrome://newtab/');
  await targetPage.goto('https://twitter.com/');

  const loginLink = await targetPage.$('a[href="/login"]');
  if (loginLink) {
    await page.click('a[href="/login"]');
  }
  // id入力欄が出るまで待つ
  const inputIdField = 'input[autocomplete="username"]';
  await targetPage.waitForSelector(inputIdField);

  await targetPage.type(inputIdField, xLoginPassword.id);
  await sleep(1000);

  const nextButton = await targetPage.waitForSelector('span ::-p-text(Next)');
  if (nextButton) {
    await targetPage.click('span ::-p-text(Next)');
  } else {
    console.log('Next button not found');
  }
  await targetPage.waitForSelector('input[autocomplete="current-password"]');
  await targetPage.type('input[autocomplete="current-password"]', xLoginPassword.password);
  sleep(1000);
  await targetPage.click('span ::-p-text(Log in)');
})();
