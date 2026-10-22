const puppeteer = require('../frontend/node_modules/puppeteer');

(async () => {
  console.log('Testing full Checkout to PayHere flow...');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  // 1. Seed cart
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('nr_cart_cache', JSON.stringify({
      items: [{
        product: {
          _id: 'prod-001',
          title: 'MagSafe Silicone Case for iPhone 15',
          price: 3500,
          discountPrice: 2800,
          stockQuantity: 10,
          imageURL: 'https://m.media-amazon.com/images/I/61vD7BqO3ML._AC_SL1500_.jpg'
        },
        quantity: 1
      }]
    }));
  });

  // 2. Go to /cart
  await page.goto('http://localhost:5173/cart', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1000));

  // 3. Click Proceed to Checkout
  console.log('Clicking Proceed to Checkout...');
  const proceedBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.innerText.includes('Proceed to Checkout'));
  });

  if (proceedBtn) {
    await proceedBtn.click();
  } else {
    await page.goto('http://localhost:5173/checkout');
  }

  await page.waitForSelector('#checkout-name', { timeout: 10000 });
  console.log('On Checkout page!');

  // 4. Fill form
  await page.type('#checkout-name', 'Kasun Perera');
  await page.type('#checkout-phone', '077 123 4567');
  await page.type('#checkout-email', 'kasun.perera@gmail.com');
  await page.type('#checkout-addr1', 'No. 45, Galle Road');
  await page.type('#checkout-city', 'Colombo');
  await page.type('#checkout-district', 'Colombo');

  console.log('Finding and clicking Pay button...');
  const payBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.innerText.includes('Pay Rs'));
  });

  if (payBtn) {
    await payBtn.click();
    console.log('Pay button clicked!');
  } else {
    console.error('Pay button not found!');
  }

  await new Promise(r => setTimeout(r, 5000));

  const frames = page.frames();
  console.log('Total frames:', frames.length);
  let found = false;
  for (const f of frames) {
    if (f.url().includes('payhere')) {
      found = true;
      console.log('====================================================');
      console.log('>>> SUCCESS! PAYHERE SANDBOX POPUP OPENED CLEANLY! <<<');
      console.log('Frame URL:', f.url());
      const text = await f.evaluate(() => document.body.innerText);
      console.log('PayHere Modal Preview:\n' + text.slice(0, 400));
      console.log('====================================================');
    }
  }

  if (!found) {
    console.error('PayHere modal did not open!');
    const pageErrors = await page.evaluate(() => {
      const errEls = Array.from(document.querySelectorAll('.text-red-600, .bg-red-50, [role="alert"]'));
      return errEls.map(e => e.innerText);
    });
    console.log('Page errors:', pageErrors);
  }

  await browser.close();
})();
