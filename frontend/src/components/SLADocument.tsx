"use client";

import React from "react";
import { SlaFormData } from "@/lib/sla";

interface Props {
  data: SlaFormData;
}

const SLADocument = React.forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  return (
    <div ref={ref} className="mnda-document">
      <section className="cover-page">
        <h1>サービスレベル契約</h1>

        <div className="field-section">
          <h3>稼働率</h3>
          <p>目標稼働率：{data.targetUptime || "【未入力】"}</p>
          <p>サブスクリプション期間：{data.subscriptionPeriod || "【未入力】"}</p>
          <p>予定ダウンタイム：{data.scheduledDowntime || "【未入力】"}</p>
        </div>

        <div className="field-section">
          <h3>サポート</h3>
          <p>サポートチャンネル：{data.supportChannel || "【未入力】"}</p>
          <p>目標応答時間：{data.targetResponseTime || "【未入力】"}</p>
        </div>

        <div className="field-section">
          <h3>サービスクレジット</h3>
          <p>稼働率クレジット：{data.uptimeCredit || "【未入力】"}</p>
          <p>応答時間クレジット：{data.responseTimeCredit || "【未入力】"}</p>
        </div>

        <p className="agreement-intro">
          各当事者は本SLAに署名することにより、発効日をもってこのサービスレベル契約に同意します。
        </p>

        <table className="party-table">
          <thead>
            <tr>
              <th></th>
              <th>プロバイダー</th>
              <th>顧客</th>
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
              <td>{data.customer.signatoryName}</td>
            </tr>
            <tr>
              <td>役職</td>
              <td>{data.provider.title}</td>
              <td>{data.customer.title}</td>
            </tr>
            <tr>
              <td>会社</td>
              <td>{data.provider.company}</td>
              <td>{data.customer.company}</td>
            </tr>
            <tr>
              <td>通知先</td>
              <td style={{ whiteSpace: "pre-wrap" }}>{data.provider.noticeAddress}</td>
              <td style={{ whiteSpace: "pre-wrap" }}>{data.customer.noticeAddress}</td>
            </tr>
          </tbody>
        </table>

        <p className="footer-note">
          Common Paper サービスレベル契約は CC BY 4.0 の下で無償利用可能。
        </p>
      </section>
    </div>
  );
});

SLADocument.displayName = "SLADocument";

export default SLADocument;
