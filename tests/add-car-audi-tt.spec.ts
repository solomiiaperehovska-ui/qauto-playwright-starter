import { test, expect } from '@playwright/test';

test('guest can add an Audi TT to Garage', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Guest log in' }).click();
  await expect(page).toHaveURL(/panel\/garage/);

  await page.getByRole('button', { name: 'Add car' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('heading', { name: 'Add a car' })).toBeVisible();

  await dialog.getByLabel('Brand').selectOption({ label: 'Audi' });
  await dialog.getByLabel('Model').selectOption({ label: 'TT' });
  await dialog.getByRole('spinbutton', { name: 'Mileage' }).fill('12000');
  await dialog.getByRole('button', { name: 'Add' }).click();

  await expect(dialog).toBeHidden();
  const audiTt = page.getByRole('listitem').filter({ hasText: 'Audi TT' });
  await expect(audiTt).toBeVisible();
  await expect(audiTt.getByRole('spinbutton')).toHaveValue('12000');
});
