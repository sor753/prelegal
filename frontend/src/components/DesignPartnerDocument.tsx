"use client";

import React from "react";
import { DesignPartnerFormData } from "@/lib/design-partner";
import { formatDate } from "@/lib/mnda";

interface Props {
  data: DesignPartnerFormData;
}

const DesignPartnerDocument = React.forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  return (
    <div ref={ref} className="mnda-document">
      <section className="cover-page">
        <h1>デザインパートナー契約</h1>

        <div className="field-section">
          <h3>発効日</h3>
          <p>{data.effectiveDate ? formatDate(data.effectiveDate) : "【未入力】"}</p>
        </div>

        <div className="field-section">
          <h3>契約期間</h3>
          <p>{data.term || "【未入力】"}</p>
        </div>

        <div className="field-section">
          <h3>料金</h3>
          <p>{data.fees || "【未入力】"}</p>
        </div>

        <div className="field-section">
          <h3>製品・サービス</h3>
          <p>{data.product || "【未入力】"}</p>
        </div>

        <div className="field-section">
          <h3>準拠法および選択裁判所</h3>
          <p>準拠法：{data.governingLaw || "【未入力】"}</p>
          <p>選択裁判所：{data.chosenCourts || "【未入力】"}</p>
        </div>

        <p className="agreement-intro">
          各当事者は表紙に署名することにより、発効日をもってこのデザインパートナー契約に同意します。
        </p>

        <table className="party-table">
          <thead>
            <tr>
              <th></th>
              <th>プロバイダー</th>
              <th>パートナー</th>
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
              <td>{data.provider.signatoryName}</td>
              <td>{data.partner.signatoryName}</td>
            </tr>
            <tr>
              <td>役職</td>
              <td>{data.provider.title}</td>
              <td>{data.partner.title}</td>
            </tr>
            <tr>
              <td>会社</td>
              <td>{data.provider.company}</td>
              <td>{data.partner.company}</td>
            </tr>
            <tr>
              <td>通知先</td>
              <td style={{ whiteSpace: "pre-wrap" }}>{data.provider.noticeAddress}</td>
              <td style={{ whiteSpace: "pre-wrap" }}>{data.partner.noticeAddress}</td>
            </tr>
          </tbody>
        </table>

        <p className="footer-note">
          Common Paper デザインパートナー契約は CC BY 4.0 の下で無償利用可能。
        </p>
      </section>
    </div>
  );
});

DesignPartnerDocument.displayName = "DesignPartnerDocument";

export default DesignPartnerDocument;
