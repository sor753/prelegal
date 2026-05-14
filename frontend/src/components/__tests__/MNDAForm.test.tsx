import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MNDAForm from "../MNDAForm";
import { makeDefaultFormData, MndaFormData } from "@/lib/mnda";

function setup(data: MndaFormData = makeDefaultFormData()) {
  const onChange = jest.fn();
  render(<MNDAForm data={data} onChange={onChange} />);
  return { onChange };
}

describe("MNDAForm", () => {
  it("目的フィールドを表示する", () => {
    setup();
    expect(screen.getByLabelText("目的")).toBeInTheDocument();
  });

  it("発効日フィールドを表示する", () => {
    setup();
    expect(screen.getByLabelText("発効日")).toBeInTheDocument();
  });

  it("準拠法フィールドを表示する", () => {
    setup();
    expect(screen.getByLabelText("準拠法（都道府県または州）")).toBeInTheDocument();
  });

  it("管轄裁判所フィールドを表示する", () => {
    setup();
    expect(screen.getByLabelText("管轄裁判所")).toBeInTheDocument();
  });

  it("当事者1・当事者2のセクションを表示する", () => {
    setup();
    expect(screen.getByText("当事者1")).toBeInTheDocument();
    expect(screen.getByText("当事者2")).toBeInTheDocument();
  });

  it("目的を変更するとonChangeが呼ばれる", async () => {
    const user = userEvent.setup();
    const data = makeDefaultFormData();
    const { onChange } = setup(data);

    const textarea = screen.getByLabelText("目的");
    // 制御コンポーネントでは各キーストロークでonChangeが独立発火する
    await user.type(textarea, "X");

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(typeof lastCall.purpose).toBe("string");
  });

  it("準拠法を変更するとonChangeが呼ばれる", async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    const input = screen.getByLabelText("準拠法（都道府県または州）");
    await user.type(input, "A");

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.governingLaw).toBe("A");
  });

  it("MNDA期間: 年数入力を変更するとonChangeが呼ばれる", async () => {
    const user = userEvent.setup();
    const data: MndaFormData = {
      ...makeDefaultFormData(),
      mndaTerm: { type: "expires", years: 1 },
    };
    const { onChange } = setup(data);

    const input = screen.getByLabelText("MNDA期間（年数）");
    // clear してから type で値を置換する
    await user.tripleClick(input);
    await user.keyboard("3");

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.mndaTerm).toEqual({ type: "expires", years: 3 });
  });

  it("MNDA期間: 0以下の年数入力は1にガードされる", async () => {
    const user = userEvent.setup();
    const data: MndaFormData = {
      ...makeDefaultFormData(),
      mndaTerm: { type: "expires", years: 1 },
    };
    const { onChange } = setup(data);

    const input = screen.getByLabelText("MNDA期間（年数）");
    await user.tripleClick(input);
    await user.keyboard("0");

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    if (lastCall.mndaTerm.type === "expires") {
      expect(lastCall.mndaTerm.years).toBeGreaterThanOrEqual(1);
    }
  });

  it("MNDA期間: 「条件付き終了」ラジオを選択できる", async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    const radio = screen.getByLabelText("MNDAの条件に従って終了するまで継続");
    await user.click(radio);

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.mndaTerm).toEqual({ type: "until_terminated" });
  });

  it("機密保持期間: 「永久に」ラジオを選択できる", async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    const radio = screen.getByLabelText("永久に");
    await user.click(radio);

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.confidentialityTerm).toEqual({ type: "perpetuity" });
  });

  it("当事者1の会社名を変更するとonChangeが呼ばれる", async () => {
    const user = userEvent.setup();
    const { onChange } = setup();

    const inputs = screen.getAllByLabelText("会社");
    await user.type(inputs[0], "A");

    expect(onChange).toHaveBeenCalled();
    // 制御コンポーネントのため最後の呼び出しに入力した文字が含まれる
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.party1.company).toBe("A");
  });
});
