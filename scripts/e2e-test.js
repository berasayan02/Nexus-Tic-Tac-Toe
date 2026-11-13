import { chromium } from '@playwright/test';
import http from 'http';
import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon',
};

function startServer(port = 4173) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = req.url.split('?')[0];
      if (reqPath === '/') reqPath = '/index.html';

      const filePath = path.join(distDir, reqPath);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
      } else {
        // Fallback to index.html for SPA
        const indexPath = path.join(distDir, 'index.html');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        fs.createReadStream(indexPath).pipe(res);
      }
    });

    server.listen(port, () => {
      console.log(`🌐 Static server serving dist on http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function run() {
  const server = await startServer(4173);

  console.log('🚀 Launching Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      passed++;
      console.log(`✅ [PASS] ${message}`);
    } else {
      failed++;
      console.error(`❌ [FAIL] ${message}`);
    }
  }

  try {
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle' });

    // 1. Header & Title
    const titleText = await page.locator('h1').textContent();
    assert(titleText.includes('TIC TAC TOE'), 'Header displays TIC TAC TOE title');

    const subtitleText = await page.locator('text=The Ultimate XO Experience').count();
    assert(subtitleText > 0, 'Subtitle "The Ultimate XO Experience" is present');

    // 1b. Precision Engine Text & New Footer
    const precisionText = await page.locator('text=PRECISION ENGINE • MINIMAX AI • WEB AUDIO SYNTHESIS').count();
    assert(precisionText === 1, 'Existing "PRECISION ENGINE • MINIMAX AI • WEB AUDIO SYNTHESIS" text preserved');

    const footerAuthor = await page.locator('text=Sayan Bera').count();
    assert(footerAuthor === 1, 'New footer displays "Sayan Bera"');

    const footerBrand = await page.locator('text=From TECHNO SB').count();
    assert(footerBrand === 1, 'New footer displays "From TECHNO SB"');

    // 2. Audio Controls
    const soundBtn = page.locator('button[aria-label*="Sound Effects"]');
    assert((await soundBtn.count()) === 1, 'Sound effects button exists');
    await soundBtn.click();
    assert((await soundBtn.count()) === 1, 'Sound effects button toggled');

    const musicBtn = page.locator('button[aria-label*="Ambient Music"]');
    assert((await musicBtn.count()) === 1, 'Music toggle button exists');
    await musicBtn.click();
    assert((await musicBtn.count()) === 1, 'Music button toggled');

    const volumeTrigger = page.locator('button[aria-label="Adjust Volume"]');
    await volumeTrigger.click();
    const volumeSlider = page.locator('input[type="range"]');
    assert((await volumeSlider.count()) === 1, 'Volume slider popover works');

    // 3. Player Cards Initial State
    assert((await page.locator('text=PLAYER 1').count()) > 0, 'Player 1 card is present');
    assert((await page.locator('text=PLAYER 2').count()) > 0, 'Player 2 card is present');
    assert((await page.locator('text=ACTIVE TURN').count()) > 0, 'Active turn indicator is glowing');

    // 4. Test PvP Gameplay & Winning Combination
    console.log('\n--- Testing PvP Match Flow ---');
    const cells = page.locator('button[aria-label^="Cell"]');
    assert((await cells.count()) === 9, 'All 9 cells rendered properly in 3x3 grid');

    // Move 1: P1 (X) clicks Cell 1 (index 0)
    await cells.nth(0).click();
    await page.waitForTimeout(100);
    assert((await cells.nth(0).getAttribute('aria-label')).includes('occupied by X'), 'Cell 1 has X');

    // Move 2: P2 (O) clicks Cell 4 (index 3)
    await cells.nth(3).click();
    await page.waitForTimeout(100);
    assert((await cells.nth(3).getAttribute('aria-label')).includes('occupied by O'), 'Cell 4 has O');

    // Move 3: P1 (X) clicks Cell 2 (index 1)
    await cells.nth(1).click();
    await page.waitForTimeout(100);

    // Move 4: P2 (O) clicks Cell 5 (index 4)
    await cells.nth(4).click();
    await page.waitForTimeout(100);

    // Move 5: P1 (X) clicks Cell 3 (index 2) -> Winning row 0, 1, 2!
    await cells.nth(2).click();
    await page.waitForTimeout(300);

    // Check Result Modal
    const resultModal = page.locator('div[role="dialog"]');
    assert((await resultModal.count()) === 1, 'Result modal appeared after victory');
    const resultHeading = await page.locator('#result-title').textContent();
    assert(resultHeading.includes('Player 1 Wins!'), 'Result heading shows "Player 1 Wins!"');

    // Check Restart Button in Result screen
    const restartBtn = page.locator('button:has-text("RESTART MATCH")');
    assert((await restartBtn.count()) === 1, 'Restart Match button exists in Result modal');

    // Click Restart Match
    await restartBtn.click();
    await page.waitForTimeout(300);

    // Board should be empty again and result modal closed
    assert((await page.locator('div[role="dialog"]').count()) === 0, 'Result modal closed on restart');
    const emptyCells = await page.locator('button[aria-label$=", empty"]').count();
    assert(emptyCells === 9, 'All 9 cells are empty after restart');

    // 5. Test Mode Switching & Reset Confirmation Workflow
    console.log('\n--- Testing Mode Switching Confirmation Workflow ---');
    // Start an active match: place move X at cell 5 (index 4)
    await cells.nth(4).click();
    await page.waitForTimeout(100);
    assert((await cells.nth(4).getAttribute('aria-label')).includes('occupied by X'), 'Cell 5 has move in progress');

    // Attempt to switch to "PLAYER VS COMPUTER" during active match
    const pvcModeBtn = page.locator('button:has-text("PLAYER VS COMPUTER")');
    await pvcModeBtn.click();
    await page.waitForTimeout(200);

    // Confirmation modal should appear
    const confirmModal = page.locator('div[role="alertdialog"]');
    assert((await confirmModal.count()) === 1, 'Confirmation modal appeared when switching mode mid-match');

    const warningText = await page.locator('#confirm-modal-desc').textContent();
    assert(
      warningText.includes(
        'Switching game mode will reset the current match. All existing X and O moves will be removed. Do you want to continue?'
      ),
      'Exact required warning message is displayed'
    );

    // Test Cancel button
    const cancelBtn = page.locator('button:has-text("CANCEL")');
    await cancelBtn.click();
    await page.waitForTimeout(200);

    assert((await page.locator('div[role="alertdialog"]').count()) === 0, 'Confirmation modal dismissed on Cancel');
    assert((await cells.nth(4).getAttribute('aria-label')).includes('occupied by X'), 'Match preserved after Cancel');

    // Attempt switch again and click OK
    await pvcModeBtn.click();
    await page.waitForTimeout(200);
    const okBtn = page.locator('button:has-text("OK")');
    await okBtn.click();
    await page.waitForTimeout(300);

    assert((await page.locator('div[role="alertdialog"]').count()) === 0, 'Modal dismissed on OK');
    const resetEmptyCells = await page.locator('button[aria-label$=", empty"]').count();
    assert(resetEmptyCells === 9, 'Board completely reset after confirming mode switch');

    // Check PvC player cards
    assert((await page.locator('text=YOU').count()) > 0, 'Player 1 is "YOU" in PvC mode');
    assert((await page.locator('text=COMPUTER').count()) > 0, 'Player 2 is "COMPUTER" in PvC mode');

    // 6. Test PvC Gameplay & Computer Automatic Intelligent Response
    console.log('\n--- Testing PvC AI Gameplay ---');
    // Human plays X at corner Cell 1 (index 0)
    await cells.nth(0).click();
    await page.waitForTimeout(100);
    assert((await cells.nth(0).getAttribute('aria-label')).includes('occupied by X'), 'Human played X');

    // Computer should automatically think and place O
    console.log('Waiting for AI response...');
    await page.waitForTimeout(900); // wait for 550ms-750ms thinking delay

    // Verify computer placed O in a valid cell (center index 4 is the optimal response)
    const occupiedCells = await page.locator('button[aria-label*="occupied by O"]').count();
    assert(occupiedCells === 1, 'Computer successfully placed its move O');
    assert((await cells.nth(4).getAttribute('aria-label')).includes('occupied by O'), 'Computer intelligently took center cell (index 4)');

    // 7. Test Responsive Viewports (No overflow)
    console.log('\n--- Testing Responsive Viewports ---');
    const viewports = [
      { width: 320, height: 640 },
      { width: 375, height: 667 },
      { width: 390, height: 844 },
      { width: 430, height: 932 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1366, height: 768 },
      { width: 1920, height: 1080 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await page.waitForTimeout(100);
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      assert(!isOverflowing, `Viewport ${vp.width}x${vp.height} has zero horizontal overflow`);
    }

    // 8. Console errors check
    assert(consoleErrors.length === 0, `Zero console errors during entire test run (found: ${consoleErrors.length})`);
    if (consoleErrors.length > 0) {
      console.error('Console errors:', consoleErrors);
    }

  } catch (err) {
    console.error('Test execution failed:', err);
    failed++;
  } finally {
    await browser.close();
    server.close();
    console.log(`\n========================================`);
    console.log(`E2E Results: ${passed} passed, ${failed} failed`);
    process.exit(failed > 0 ? 1 : 0);
  }
}

run();
