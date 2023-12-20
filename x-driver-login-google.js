import puppeteer from 'puppeteer-extra';
import SealthPlugin from 'puppeteer-extra-plugin-stealth';
import { xLonginGoogle } from './data/x-login.js';
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

  await targetPage.waitForSelector('span ::-p-text(Google でログイン)');

  // click Google login button then wait for popup
  const [googleSignInPopup] = await Promise.all([
    new Promise((resolve) => page.once('popup', resolve)),
    page.click('span ::-p-text(Google でログイン)'),
  ]);
  await googleSignInPopup.setBypassCSP(true);
  await googleSignInPopup.waitForSelector('input[type="email"]');
  await sleep(2000);
  await googleSignInPopup.type('input[type="email"]', xLonginGoogle.id, { delay: 500 });
  await googleSignInPopup.keyboard.press('Enter');

  await sleep(2000);
  //await googleSignInPopup.waitForSelector('input[type="password"]');
  await googleSignInPopup.waitForTimeout(2000);
  console.log('found element password');
  // type keyborad but sometimes some key is not typed, so type dammy then delete
  await googleSignInPopup.type('input[type="password"]', 'xyza', { delay: 500 });
  await googleSignInPopup.keyboard.press('Backspace');
  await googleSignInPopup.keyboard.press('Backspace');
  await googleSignInPopup.keyboard.press('Backspace');
  await googleSignInPopup.keyboard.press('Backspace');
  // type password
  await googleSignInPopup.type('input[type="password"]', xLonginGoogle.password, { delay: 500 });
  console.log(`type password=${xLonginGoogle.password}`);
  await sleep(500);
  await googleSignInPopup.click('span ::-p-text(Next)');
})();
