"use client";

import React from "react";
import { MndaFormData, formatDate } from "@/lib/mnda";

interface Props {
  data: MndaFormData;
}

const MNDACoverPageDocument = React.forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const { mndaTerm, confidentialityTerm } = data;

  return (
    <div ref={ref} className="mnda-document">
      <section className="cover-page">
        <h1>相互秘密保持契約</h1>

        <div className="usage-note">
          <h2>この相互秘密保持契約の使用について</h2>
          <p>
            この相互秘密保持契約（以下「MNDA」）は以下から構成されます：（1）この表紙（以下「<strong>表紙</strong>」）および
            （2）commonpaper.com/standards/mutual-nda/1.0 に掲載されているものと同一のCommon Paper相互NDA標準条件バージョン1.0（以下「<strong>標準条件</strong>」）。
            標準条件への変更は表紙に記載する必要があり、標準条件との矛盾がある場合は表紙が優先します。
          </p>
        </div>

        <div className="field-section">
          <h3>目的</h3>
          <p className="field-label">機密情報の使用方法</p>
          <p>{data.purpose || "【未入力】"}</p>
        </div>

        <div className="field-section">
          <h3>発効日</h3>
          <p>{data.effectiveDate ? formatDate(data.effectiveDate) : "【未入力】"}</p>
        </div>

        <div className="field-section">
          <h3>MNDA期間</h3>
          <p className="field-label">このMNDAの有効期間</p>
          <p>
            {mndaTerm.type === "expires" ? "☑" : "☐"}&nbsp;&nbsp;発効日から{mndaTerm.type === "expires" ? mndaTerm.years : "___"}年後に失効。
          </p>
          <p>
            {mndaTerm.type === "until_terminated" ? "☑" : "☐"}&nbsp;&nbsp;MNDAの条件に従って終了するまで継続。
          </p>
        </div>

        <div className="field-section">
          <h3>機密保持期間</h3>
          <p className="field-label">機密情報が保護される期間</p>
          <p>
            {confidentialityTerm.type === "years" ? "☑" : "☐"}&nbsp;&nbsp;
            発効日から{confidentialityTerm.type === "years" ? confidentialityTerm.years : "___"}年間。ただし、営業秘密については、機密情報が適用法上の営業秘密でなくなるまで。
          </p>
          <p>
            {confidentialityTerm.type === "perpetuity" ? "☑" : "☐"}&nbsp;&nbsp;永久に。
          </p>
        </div>

        <div className="field-section">
          <h3>準拠法および管轄</h3>
          <p>準拠法：{data.governingLaw || "【未入力】"}</p>
          <p>管轄：{data.jurisdiction || "【未入力】"}</p>
        </div>

        {data.modifications && (
          <div className="field-section">
            <h3>MNDAの変更</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{data.modifications}</p>
          </div>
        )}

        <p className="agreement-intro">
          各当事者は表紙に署名することにより、発効日をもってこのMNDAに同意します。
        </p>

        <table className="party-table">
          <thead>
            <tr>
              <th></th>
              <th>当事者1</th>
              <th>当事者2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>署名</td>
              <td className="signature-cell"></td>
              <td className="signature-cell"></td>
            </tr>
            <tr>
              <td>署名者氏名</td>
              <td>{data.party1.signatoryName}</td>
              <td>{data.party2.signatoryName}</td>
            </tr>
            <tr>
              <td>役職</td>
              <td>{data.party1.title}</td>
              <td>{data.party2.title}</td>
            </tr>
            <tr>
              <td>会社</td>
              <td>{data.party1.company}</td>
              <td>{data.party2.company}</td>
            </tr>
            <tr>
              <td>通知先</td>
              <td style={{ whiteSpace: "pre-wrap" }}>{data.party1.noticeAddress}</td>
              <td style={{ whiteSpace: "pre-wrap" }}>{data.party2.noticeAddress}</td>
            </tr>
            <tr>
              <td>日付</td>
              <td>{data.party1.date ? formatDate(data.party1.date) : ""}</td>
              <td>{data.party2.date ? formatDate(data.party2.date) : ""}</td>
            </tr>
          </tbody>
        </table>

        <p className="footer-note">
          Common Paper 相互秘密保持契約（バージョン1.0）は CC BY 4.0 の下で無償利用可能。
        </p>
      </section>
    </div>
  );
});

MNDACoverPageDocument.displayName = "MNDACoverPageDocument";

export default MNDACoverPageDocument;
