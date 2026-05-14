import { render, screen } from "@testing-library/react";
import MNDADocument from "../MNDADocument";
import { makeDefaultFormData, MndaFormData } from "@/lib/mnda";

const baseData: MndaFormData = {
  ...makeDefaultFormData(),
  purpose: "テスト目的",
  effectiveDate: "2025-06-01",
  governingLaw: "東京都",
  jurisdiction: "東京地方裁判所",
  modifications: "",
  party1: {
    signatoryName: "山田 太郎",
    title: "代表取締役",
    company: "株式会社A",
    noticeAddress: "test@company-a.co.jp",
    date: "2025-06-01",
  },
  party2: {
    signatoryName: "鈴木 花子",
    title: "取締役",
    company: "株式会社B",
    noticeAddress: "test@company-b.co.jp",
    date: "2025-06-01",
  },
};

describe("MNDADocument", () => {
  it("タイトルを表示する", () => {
    render(<MNDADocument data={baseData} />);
    expect(screen.getByText("相互秘密保持契約")).toBeInTheDocument();
  });

  it("目的を表示する", () => {
    render(<MNDADocument data={baseData} />);
    expect(screen.getAllByText("テスト目的").length).toBeGreaterThan(0);
  });

  it("発効日を日本語形式で表示する", () => {
    render(<MNDADocument data={baseData} />);
    expect(screen.getAllByText("2025年6月1日").length).toBeGreaterThan(0);
  });

  it("当事者1の会社名を表示する", () => {
    render(<MNDADocument data={baseData} />);
    expect(screen.getByText("株式会社A")).toBeInTheDocument();
  });

  it("当事者2の会社名を表示する", () => {
    render(<MNDADocument data={baseData} />);
    expect(screen.getByText("株式会社B")).toBeInTheDocument();
  });

  it("準拠法を表示する", () => {
    render(<MNDADocument data={baseData} />);
    expect(screen.getAllByText(/東京都/).length).toBeGreaterThan(0);
  });

  it("MNDA期間: 年数指定の場合チェックマークと年数を表示する", () => {
    const data: MndaFormData = {
      ...baseData,
      mndaTerm: { type: "expires", years: 2 },
    };
    render(<MNDADocument data={data} />);
    expect(screen.getAllByText(/発効日から2年後に失効/).length).toBeGreaterThan(0);
  });

  it("MNDA期間: 条件終了の場合チェックマークを表示する", () => {
    const data: MndaFormData = {
      ...baseData,
      mndaTerm: { type: "until_terminated" },
    };
    render(<MNDADocument data={data} />);
    expect(screen.getAllByText(/MNDAの条件に従って終了するまで継続/).length).toBeGreaterThan(0);
  });

  it("機密保持期間: 永久の場合を表示する", () => {
    const data: MndaFormData = {
      ...baseData,
      confidentialityTerm: { type: "perpetuity" },
    };
    render(<MNDADocument data={data} />);
    expect(screen.getAllByText(/永久に。/).length).toBeGreaterThan(0);
  });

  it("入力が空の場合【未入力】プレースホルダーを表示する", () => {
    const data: MndaFormData = {
      ...baseData,
      governingLaw: "",
      jurisdiction: "",
    };
    const { container } = render(<MNDADocument data={data} />);
    expect(container.textContent).toContain("【未入力】");
  });

  it("変更事項がある場合に表示する", () => {
    const data: MndaFormData = {
      ...baseData,
      modifications: "第9条を変更する",
    };
    render(<MNDADocument data={data} />);
    expect(screen.getByText("第9条を変更する")).toBeInTheDocument();
  });

  it("変更事項が空の場合はセクションを表示しない", () => {
    render(<MNDADocument data={baseData} />);
    expect(screen.queryByText("MNDAの変更")).not.toBeInTheDocument();
  });

  it("標準条件の本文を表示する", () => {
    render(<MNDADocument data={baseData} />);
    expect(screen.getAllByText("標準条件").length).toBeGreaterThan(0);
  });
});
