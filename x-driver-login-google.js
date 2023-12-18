const puppeteer = require('puppeteer'); // v20.7.4 or later

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const timeout = 25000;
  const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
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
  } else {
    console.log('Login link not found');
  }
  sleep(1000);

  // Click sign in with google
  await targetPage.waitForSelector('span ::-p-text(Google でログイン)');
  await targetPage.click('span ::-p-text(Google でログイン)');

  // https://accounts.google.com/v3/signin/identifier?continue
  const target = await browser.waitForTarget(
    (t) =>
      t.url() ===
      'https://accounts.google.com/gsi/button?theme=outline&size=large&shape=circle&logo_alignment=center&text=signin_with&width=300&client_id=49625052041-kgt0hghf445lmcmhijv46b715m2mpbct.apps.googleusercontent.com&iframe_id=gsi_24610_181749&as=xKFsQUlzoY3sonm6o9mwFQ&hl=ja',
    { timeout }
  );
  const popupPage = await target.page();
  popupPage.setDefaultTimeout(timeout);

  console.log(popupPage.title);
  await popupPage.waitForSelector('input[type="email"]');
  console.log(popupPage.title);
  await popupPage.type('input[type="email"]', 'test@example.com');
})();
