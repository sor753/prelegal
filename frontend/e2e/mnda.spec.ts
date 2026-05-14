import { test, expect } from "@playwright/test";

test.describe("MNDA作成ツール", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("ページが正常に表示される", async ({ page }) => {
    await expect(page).toHaveTitle(/MNDA作成ツール/);
    await expect(page.getByRole("heading", { name: "MNDA作成ツール" })).toBeVisible();
    await expect(page.getByText("入力フォーム")).toBeVisible();
    await expect(page.getByText("プレビュー")).toBeVisible();
  });

  test("プレビューに初期コンテンツが表示される", async ({ page }) => {
    await expect(page.getByText("相互秘密保持契約").first()).toBeVisible();
    // 標準条件はスクロール位置にあるため、プレビュー内に存在することを確認
    await expect(page.locator(".mnda-document")).toContainText("標準条件");
  });

  test("目的を入力するとプレビューがリアルタイムで更新される", async ({ page }) => {
    const purposeField = page.getByLabel("目的");
    await purposeField.clear();
    await purposeField.fill("新製品の共同開発に向けた情報共有");

    await expect(page.getByText("新製品の共同開発に向けた情報共有").first()).toBeVisible();
  });

  test("準拠法を入力するとプレビューに反映される", async ({ page }) => {
    const input = page.getByLabel("準拠法（都道府県または州）");
    await input.fill("東京都");

    await expect(page.getByText(/東京都/).first()).toBeVisible();
  });

  test("管轄裁判所を入力するとプレビューに反映される", async ({ page }) => {
    const input = page.getByLabel("管轄裁判所");
    await input.fill("東京地方裁判所");

    await expect(page.getByText(/東京地方裁判所/).first()).toBeVisible();
  });

  test("当事者1の会社名を入力するとプレビューに反映される", async ({ page }) => {
    const input = page.getByLabel("会社").first();
    await input.fill("株式会社テスト");

    await expect(page.getByText("株式会社テスト")).toBeVisible();
  });

  test("当事者2の会社名を入力するとプレビューに反映される", async ({ page }) => {
    const inputs = page.getByLabel("会社");
    await inputs.nth(1).fill("合同会社サンプル");

    await expect(page.getByText("合同会社サンプル")).toBeVisible();
  });

  test("MNDA期間: 「条件付き終了」を選択できる", async ({ page }) => {
    const radio = page.getByLabel("MNDAの条件に従って終了するまで継続");
    await radio.click();

    // プレビューが更新されてチェックマークが付く
    await expect(page.locator(".mnda-document").getByText(/MNDAの条件に従って終了するまで継続/).first()).toBeVisible();
  });

  test("機密保持期間: 「永久に」を選択できる", async ({ page }) => {
    const radio = page.getByLabel("永久に");
    await radio.click();

    await expect(page.locator(".mnda-document").getByText(/永久に。/).first()).toBeVisible();
  });

  test("MNDA期間の年数を変更するとプレビューが更新される", async ({ page }) => {
    const yearsInput = page.getByLabel("MNDA期間（年数）");
    await yearsInput.fill("3");

    await expect(page.locator(".mnda-document").getByText(/3年後に失効/).first()).toBeVisible();
  });

  test("発効日を変更するとプレビューが日本語形式で表示される", async ({ page }) => {
    // id指定でラジオボタンの誤マッチを回避
    const dateInput = page.locator("#effectiveDate");
    await dateInput.fill("2025-07-01");

    await expect(page.locator(".mnda-document")).toContainText("2025年7月1日");
  });

  test("「PDFとして印刷・保存」ボタンが表示される", async ({ page }) => {
    await expect(page.getByRole("button", { name: "PDFとして印刷・保存" })).toBeVisible();
  });

  test("MNDAの変更欄を入力するとプレビューに表示される", async ({ page }) => {
    const textarea = page.locator("#modifications");
    await textarea.fill("第9条の管轄は大阪地方裁判所とする");

    await expect(page.locator(".mnda-document")).toContainText("第9条の管轄は大阪地方裁判所とする");
  });

  test("完全なフォーム入力フローが機能する", async ({ page }) => {
    // 基本情報
    await page.getByLabel("目的").fill("業務提携の検討");
    await page.locator("#effectiveDate").fill("2025-10-01");

    // 準拠法・管轄
    await page.getByLabel("準拠法（都道府県または州）").fill("東京都");
    await page.getByLabel("管轄裁判所").fill("東京地方裁判所");

    // 当事者1
    const party1Company = page.getByLabel("会社").first();
    await party1Company.fill("株式会社Alpha");

    // 当事者2
    const party2Company = page.getByLabel("会社").nth(1);
    await party2Company.fill("株式会社Beta");

    // プレビュー全体の確認
    const preview = page.locator(".mnda-document");
    await expect(preview.getByText("業務提携の検討").first()).toBeVisible();
    await expect(preview.getByText(/2025年10月1日/).first()).toBeVisible();
    await expect(preview.getByText("株式会社Alpha")).toBeVisible();
    await expect(preview.getByText("株式会社Beta")).toBeVisible();
  });
});
