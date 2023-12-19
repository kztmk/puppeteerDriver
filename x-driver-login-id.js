// const puppeteer = require('puppeteer'); // v20.7.4 or later
import puppeteer from 'puppeteer';
import { xLoginPassword } from './data/x-login.js';
import { sleep } from './utils.js';

(async () => {
  const browser = await puppeteer.launch({ headless: false, args: ['--lang=ja'] });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'ja-JP' });
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

  await targetPage.waitForSelector('a[href="/login"]', { timeout: timeout });
  const loginLink = await targetPage.$('a[href="/login"]');
  if (loginLink) {
    await page.click('a[href="/login"]');
    console.log('login link clicked');
  } else {
    console.log('login link not found');
  }

  await sleep(1500);
  // id入力欄が出るまで待つ
  const inputIdField = 'input[autocomplete="username"]';
  await targetPage.waitForSelector(inputIdField);

  await targetPage.type(inputIdField, xLoginPassword.id);
  await sleep(1000);

  const nextButton = await targetPage.waitForSelector('span ::-p-text(次へ)');
  if (nextButton) {
    await targetPage.click('span ::-p-text(次へ)');
  } else {
    console.log('Next button not found');
  }
  await sleep(1000);
  await targetPage.waitForSelector('input[autocomplete="current-password"]');
  await targetPage.type('input[autocomplete="current-password"]', xLoginPassword.password, {
    delay: 800,
  });
  sleep(1000);
  await targetPage.click('span ::-p-text(ログイン)');
  await sleep(1000);
  try {
    await targetPage.waitForSelector('div[aria-label="閉じる"]');
    await sleep(1000);
    await targetPage.click('div[aria-label="閉じる"]');
  } catch (e) {
    console.log('2tier auth request not found');
  }
})();
