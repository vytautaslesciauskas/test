import { test, expect } from '@playwright/test';
import axios from 'axios'
import * as fs from 'fs'

test('has title', async ({ page }) => {
  await page.goto('https://getipass.com/');

  await page.locator('//button[@id="landing_logIn"]').click();
  await page.locator('//input[@id="_com_liferay_login_web_portlet_LoginPortlet_usernameFromP"]').fill('kmsexpressinc');
  await page.locator('//input[@id="_com_liferay_login_web_portlet_LoginPortlet_password-field"]').fill('Emma@1201');
  await page.locator('//button[@id="loginBtn"]').click();
  await page.waitForSelector('//button[@id="overview_add_funds_button"]', { timeout: 20000 })
  await page.locator('//button[@id="overView_popup_notNow_btn"]').click();
  await page.locator('//*[@data-testid="NotificationsOutlinedIcon"]').click();
  await page.locator('//button[@id="Messages_tab"]').click();
  await page.locator('//button//span[text()=\'Download\']').first().click()

  const downloadPromise = page.waitForEvent('download');


  const download = await downloadPromise;
  const savePath = './' + download.suggestedFilename();

  await download.saveAs(savePath);
  const fileContent = fs.readFileSync(savePath, 'utf-8');
  console.log('File Content:', fileContent);
  await axios.post("https://pgf.lt/spedlite/ipass/getJson.php", { data: JSON.stringify(fileContent) });
  fs.unlinkSync(savePath);
});

