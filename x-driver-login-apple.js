import puppeteer from 'puppeteer-extra';
import SealthPlugin from 'puppeteer-extra-plugin-stealth';
import { xLoginApple } from './data/x-login.js';
import { sleep } from './utils.js';

puppeteer.use(SealthPlugin());
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--lang=ja', '--no-sandbox', '--disable-gpu', '--enable-webgl'],
  });
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

  await sleep(1000);
  await targetPage.waitForSelector('a[href="/login"]', { timeout: timeout });
  const loginLink = await targetPage.$('a[href="/login"]');
  if (loginLink) {
    await page.click('a[href="/login"]');
  } else {
    console.log('Login link not found');
  }
  await sleep(1000);

  await targetPage.waitForSelector('span ::-p-text(Appleのアカウントでログイン)');

  // click Google login button then wait for popup
  const [appleSignInPopup] = await Promise.all([
    new Promise((resolve) => page.once('popup', resolve)),
    page.click('span ::-p-text(Appleのアカウントでログイン)'),
  ]);
  await appleSignInPopup.setBypassCSP(true);
  await appleSignInPopup.waitForSelector('input#account_name_text_field');
  await appleSignInPopup.type('input#account_name_text_field', xLoginApple.id, { delay: 200 });
  await appleSignInPopup.keyboard.press('Enter');

  await sleep(2000);
  await appleSignInPopup.waitForSelector('button#continue-password');

  console.log('found element continue password button');
  await sleep(800);
  await appleSignInPopup.click('button#continue-password');
  await sleep(800);
  await appleSignInPopup.waitForSelector('input#password_text_field');
  await sleep(800);
  await appleSignInPopup.type('input#password_text_field', xLoginApple.password, { delay: 200 });
  await sleep(800);
  await appleSignInPopup.keyboard.press('Enter');
})();
