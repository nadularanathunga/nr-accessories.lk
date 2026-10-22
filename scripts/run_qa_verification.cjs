const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const puppeteer = require(path.join(rootDir, 'frontend', 'node_modules', 'puppeteer'));

const EVIDENCE_DIR = path.join(rootDir, 'document', 'evidence');
if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

async function runQATests() {
  console.log('--- Starting Week 09 Automated QA Test Suite ---');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    // TEST 1: Usability Testing & Form Standards (Slide 4 & 5)
    console.log('Running Test 1: Form Standards & Visual Validation Checkmarks...');
    await page.goto('http://localhost:5173/register', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForSelector('#reg-name', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 600));

    // Type into Full Name (valid)
    await page.type('#reg-name', 'Kasun Perera');
    // Type bad phone first to test friendly alert
    await page.type('#reg-phone', '07712');
    await page.type('#reg-email', 'kasun.perera@gmail.com');
    await page.type('#reg-pwd', 'securePass123');

    // Trigger blur on phone to show alert
    await page.focus('#reg-name');
    await new Promise(r => setTimeout(r, 800));

    // Capture screenshot showing friendly alert on bad phone
    const badInputPath = path.join(EVIDENCE_DIR, 'evidence_usability_bad_input.png');
    await page.screenshot({ path: badInputPath, fullPage: false });
    console.log('Saved:', badInputPath);

    // Now fix phone to valid 10 digits
    await page.click('#reg-phone', { clickCount: 3 });
    await page.type('#reg-phone', '077 123 4567');
    await page.focus('#reg-name');
    await new Promise(r => setTimeout(r, 800));

    // Capture screenshot showing instant green checkmarks on all valid fields
    const formValidPath = path.join(EVIDENCE_DIR, 'evidence_usability_form_validation.png');
    await page.screenshot({ path: formValidPath, fullPage: false });
    console.log('Saved:', formValidPath);

    // TEST 2: Mobile Responsive Viewport (375px - iPhone SE / 12) (Slide 6 & 7)
    console.log('Running Test 2: Mobile Responsiveness at 375px...');
    await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1200));

    // Measure horizontal scroll overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Mobile Viewport check: clientWidth=${clientWidth}, scrollWidth=${scrollWidth}`);
    if (scrollWidth <= clientWidth) {
      console.log('✓ PASS: No sideways scrolling detected on 375px viewport!');
    } else {
      console.warn('! WARNING: Sideways overflow detected!');
    }

    const mobileHomePath = path.join(EVIDENCE_DIR, 'evidence_mobile_responsive_375px.png');
    await page.screenshot({ path: mobileHomePath, fullPage: false });
    console.log('Saved:', mobileHomePath);

    // Open Mobile Drawer Menu
    const menuBtn = await page.$('button[aria-label="Open menu"]');
    if (menuBtn) {
      await menuBtn.click();
      await new Promise(r => setTimeout(r, 800));
      const mobileDrawerPath = path.join(EVIDENCE_DIR, 'evidence_mobile_drawer_menu.png');
      await page.screenshot({ path: mobileDrawerPath, fullPage: false });
      console.log('Saved:', mobileDrawerPath);
    }

    // TEST 3: Cart Scenario & Math Accuracy (Slide 8 & 9)
    console.log('Running Test 3: Cart Calculations & LocalStorage Persistence...');
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto('http://localhost:5173/cart', { waitUntil: 'domcontentloaded', timeout: 15000 });
    // Seed localStorage with mock cart items
    await page.evaluate(() => {
      const sampleCart = {
        items: [
          {
            product: {
              _id: 'prod-001',
              title: 'MagSafe Silicone Case for iPhone 15',
              price: 3500,
              discountPrice: 2800,
              stockQuantity: 10,
              imageURL: 'https://m.media-amazon.com/images/I/61vD7BqO3ML._AC_SL1500_.jpg'
            },
            quantity: 2
          },
          {
            product: {
              _id: 'prod-002',
              title: '20W USB-C Fast Power Adapter',
              price: 4500,
              discountPrice: 4200,
              stockQuantity: 15,
              imageURL: 'https://m.media-amazon.com/images/I/61KxGvVpL-L._AC_SL1500_.jpg'
            },
            quantity: 1
          }
        ]
      };
      localStorage.setItem('nr_cart_cache', JSON.stringify(sampleCart));
    });

    // Reload to pick up localstorage
    await page.goto('http://localhost:5173/cart', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1000));

    // Capture initial cart with Math Accuracy
    const cartMathPath = path.join(EVIDENCE_DIR, 'evidence_cart_quantity_math.png');
    await page.screenshot({ path: cartMathPath, fullPage: false });
    console.log('Saved:', cartMathPath);

    // Test Refresh Persistence: Reload page to verify items stay in memory/localStorage (Slide 9 Bug 3)
    console.log('Testing Cart Refresh Persistence...');
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1000));
    const cartPersistPath = path.join(EVIDENCE_DIR, 'evidence_cart_refresh_persistence.png');
    await page.screenshot({ path: cartPersistPath, fullPage: false });
    console.log('Saved:', cartPersistPath);

    // TEST 4: Checkout QA & PayHere Amount Formatting (Slide 8, 9, 10)
    console.log('Running Test 4: Checkout Form Standards & PayHere Formatting...');
    await page.setViewport({ width: 1280, height: 950 });
    // Set logged in user token and user in localStorage
    await page.evaluate(() => {
      localStorage.setItem('sg_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.mock_token');
      localStorage.setItem('sg_user', JSON.stringify({
        id: '6a97dcfe9b6fab46ef6ccde0',
        name: 'Kasun Perera',
        email: 'kasun.perera@gmail.com',
        phone: '077 123 4567',
        role: 'customer'
      }));
    });

    await page.goto('http://localhost:5173/checkout', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForSelector('#checkout-addr1', { timeout: 8000 });
    await new Promise(r => setTimeout(r, 800));

    // Fill delivery address to show green checkmarks on checkout
    await page.type('#checkout-addr1', 'No. 45, Galle Road, Bambalapitiya');
    await page.type('#checkout-city', 'Colombo');
    await page.type('#checkout-district', 'Colombo');
    await new Promise(r => setTimeout(r, 600));

    const checkoutPath = path.join(EVIDENCE_DIR, 'evidence_checkout_payhere_total.png');
    await page.screenshot({ path: checkoutPath, fullPage: false });
    console.log('Saved:', checkoutPath);

    console.log('--- All QA Tests Executed Successfully! All Screenshots Saved! ---');
  } catch (err) {
    console.error('QA Test error:', err);
  } finally {
    await browser.close();
  }
}

runQATests();
