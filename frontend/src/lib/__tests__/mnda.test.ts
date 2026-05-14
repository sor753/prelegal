import { formatDate, makeDefaultFormData } from "../mnda";

describe("formatDate", () => {
  it("ISO日付を日本語形式に変換する", () => {
    expect(formatDate("2025-01-15")).toBe("2025年1月15日");
    expect(formatDate("2025-12-01")).toBe("2025年12月1日");
    expect(formatDate("2026-05-15")).toBe("2026年5月15日");
  });

  it("先頭ゼロを除去する", () => {
    expect(formatDate("2025-01-01")).toBe("2025年1月1日");
    expect(formatDate("2025-09-09")).toBe("2025年9月9日");
  });

  it("空文字列を返す（入力が空の場合）", () => {
    expect(formatDate("")).toBe("");
  });

  it("タイムゾーンに関係なく正しい日付を返す（UTC問題なし）", () => {
    // "2025-01-15" は UTC midnight でパースされるが、文字列分割なので日付がずれない
    expect(formatDate("2025-01-15")).toBe("2025年1月15日");
  });
});

describe("makeDefaultFormData", () => {
  it("今日の日付をeffectiveDateに設定する", () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    const today = `${y}-${m}-${d}`;

    const data = makeDefaultFormData();
    expect(data.effectiveDate).toBe(today);
  });

  it("毎回呼ぶたびに新しいオブジェクトを返す", () => {
    const a = makeDefaultFormData();
    const b = makeDefaultFormData();
    expect(a).not.toBe(b);
  });

  it("デフォルトのMNDA期間は1年失効", () => {
    const data = makeDefaultFormData();
    expect(data.mndaTerm).toEqual({ type: "expires", years: 1 });
  });

  it("デフォルトの機密保持期間は1年", () => {
    const data = makeDefaultFormData();
    expect(data.confidentialityTerm).toEqual({ type: "years", years: 1 });
  });

  it("デフォルトの当事者情報は空文字列", () => {
    const data = makeDefaultFormData();
    expect(data.party1.signatoryName).toBe("");
    expect(data.party2.company).toBe("");
  });
});
