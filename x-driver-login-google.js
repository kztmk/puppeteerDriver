import puppeteer from 'puppeteer';
import { xLonginGoogle } from './data/x-login.js';
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

  sleep(1000);
  await targetPage.waitForSelector('a[href="/login"]', { timeout: timeout });
  const loginLink = await targetPage.$('a[href="/login"]');
  if (loginLink) {
    await page.click('a[href="/login"]');
  } else {
    console.log('Login link not found');
  }
  sleep(1000);

  await targetPage.waitForSelector('span ::-p-text(Google でログイン)');

  // click Google login button then wait for popup
  const [googleSignInPopup] = await Promise.all([
    new Promise((resolve) => page.once('popup', resolve)),
    page.click('span ::-p-text(Google でログイン)'),
  ]);

  await googleSignInPopup.waitForSelector('input[type="email"]');
  await googleSignInPopup.type('input[type="email"]', xLonginGoogle.id);

  sleep(2000);

  await googleSignInPopup.click('span ::-p-text(次へ)');
  await googleSignInPopup.waitForSelector('input[type="password"]');
  sleep(2000);
  await googleSignInPopup.type('input[type="password"]', xLonginGoogle.password);
  sleep(500);
  await googleSignInPopup.click('span ::-p-text(次へ)');
})();
