"use client";

import React from "react";
import { MndaFormData, formatDate } from "@/lib/mnda";

interface Props {
  data: MndaFormData;
}

const MNDADocument = React.forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const { mndaTerm, confidentialityTerm } = data;

  const mndaTermText =
    mndaTerm.type === "expires"
      ? `発効日から${mndaTerm.years}年後に失効`
      : "MNDAの条件に従って終了するまで継続";

  const confidentialityTermText =
    confidentialityTerm.type === "years"
      ? `発効日から${confidentialityTerm.years}年間。ただし、営業秘密については、機密情報が適用法上の営業秘密でなくなるまで`
      : "永久に";

  return (
    <div ref={ref} className="mnda-document">
      {/* Cover Page */}
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

      {/* Page break */}
      <div className="page-break" />

      {/* Standard Terms */}
      <section className="standard-terms">
        <h1>標準条件</h1>

        <ol>
          <li>
            <strong>はじめに</strong>。この相互秘密保持契約（以下の標準条件および表紙（以下に定義）を組み込むもの）（以下「<strong>MNDA</strong>」）は、各当事者（以下「<strong>開示者</strong>」）が、
            <u>目的</u>（{data.purpose || "【未入力】"}）に関連して、（1）開示者が受領者（以下「<strong>受領者</strong>」）に対して「機密」、「専有」等として識別した情報、または（2）その性質および開示の状況から機密または専有として合理的に理解されるべき情報（以下「<strong>機密情報</strong>」）を開示または利用可能にすることを可能にします。各当事者の機密情報には、当事者間の協議の存在・状況および表紙上の情報も含まれます。機密情報には、技術的または事業上の情報、製品の設計やロードマップ、要件、価格設定、セキュリティおよびコンプライアンス文書、技術、発明、ノウハウが含まれます。このMNDAを使用するには、当事者はこれらの標準条件を組み込んだ表紙（以下「<strong>表紙</strong>」）を作成し署名しなければなりません。各当事者は表紙に記載され、大文字の用語は本文または表紙に記載された意味を持ちます。
          </li>

          <li>
            <strong>機密情報の使用および保護</strong>。受領者は：（a）機密情報を<u>目的</u>のためにのみ使用すること；（b）開示者の事前の書面による承認なく機密情報を第三者に開示しないこと。ただし、受領者は、<u>目的</u>のために合理的な知る必要性を有するその従業員、代理人、顧問、請負業者およびその他の代表者に機密情報を開示することができます。これらの代表者はMNDAの該当条件と同等以上の機密保持義務に拘束され、受領者はMNDAへの遵守について責任を負うものとします；（c）受領者が自社の類似情報に対して使用する保護と少なくとも同等の保護を用いて機密情報を保護すること。ただし合理的な注意基準を下回ってはなりません。
          </li>

          <li>
            <strong>例外</strong>。本MNDAにおける受領者の義務は、受領者が以下を立証できる情報には適用されません：（a）受領者の過失によらず公に利用可能になった、またはなる情報；（b）開示者から受領した時点で、機密保持制限なく正当に知っていた、または所有していた情報；（c）機密保持制限なく第三者から正当に取得した情報；（d）機密情報を使用または参照することなく独立して開発した情報。
          </li>

          <li>
            <strong>法律により要求される開示</strong>。受領者は、法律、規制もしくは規制当局、召喚状または裁判所命令により要求される範囲で機密情報を開示することができます。ただし（法律により許可される範囲で）、受領者は開示者に開示が必要となることについて合理的な事前通知を行い、機密情報の機密扱いの取得に向けた開示者の努力に開示者の費用負担で合理的に協力するものとします。
          </li>

          <li>
            <strong>期間および終了</strong>。このMNDAは<u>発効日</u>（{data.effectiveDate ? formatDate(data.effectiveDate) : "【未入力】"}）に開始し、<u>MNDA期間</u>（{mndaTermText}）の終了時に失効します。いずれかの当事者は、相手方への書面による通知により、理由の有無にかかわらずMNDAを終了することができます。機密情報に関する受領者の義務は、MNDAの失効または終了にもかかわらず、<u>機密保持期間</u>（{confidentialityTermText}）の間、存続します。
          </li>

          <li>
            <strong>機密情報の返還または破棄</strong>。このMNDAの失効もしくは終了時、または開示者のより早期の要求があった場合、受領者は：（a）機密情報の使用を停止すること；（b）開示者の書面による要求後速やかに、受領者が所有または管理する全ての機密情報を破棄または開示者に返還すること；（c）開示者の要求がある場合、これらの義務への遵守を書面で確認すること。（b）の例外として、受領者は標準的なバックアップまたは記録保持方針に従って、または法律により要求される場合に機密情報を保持することができますが、MNDAの条件は保持された機密情報に引き続き適用されます。
          </li>

          <li>
            <strong>所有権</strong>。開示者は機密情報に関するすべての知的財産権およびその他の権利を保持し、受領者への開示はかかる権利の下でのライセンスを付与しません。
          </li>

          <li>
            <strong>免責事項</strong>。すべての機密情報は「現状有姿」で提供され、すべての欠陥を含み、権原、商品性、特定目的適合性の黙示保証を含む保証なしに提供されます。
          </li>

          <li>
            <strong>準拠法および管轄</strong>。このMNDAおよびこれに関するすべての事項は、<u>準拠法</u>（{data.governingLaw || "【未入力】"}）の法律に準拠し、かかる準拠法の抵触法規定を考慮せずに解釈されます。このMNDAに関する訴訟、訴え、または手続きは、<u>管轄</u>（{data.jurisdiction || "【未入力】"}）に所在する連邦または州裁判所に提起されなければなりません。各当事者は、かかる訴訟、訴え、または手続きにおいて管轄裁判所の専属的管轄に取消不能的に服するものとします。
          </li>

          <li>
            <strong>差止救済</strong>。このMNDAの違反は、金銭的損害では不十分な回復不能な損害を引き起こす場合があります。このMNDAの違反が発生した場合、開示者は他の救済手段に加えて、差止命令を含む適切な衡平法上の救済を求める権利を有します。
          </li>

          <li>
            <strong>一般条項</strong>。いずれの当事者も、このMNDAの下で相手方に機密情報を開示する義務や提案された取引を進める義務を負いません。いずれの当事者も、相手方の事前の書面による同意なくこのMNDAを譲渡することはできません。ただし、いずれかの当事者は、合併、再編、取得、または全資産もしくは議決権証券の実質的に全部の移転に関連してMNDAを譲渡することができます。本条項に違反する譲渡は無効です。このMNDAは各当事者の許可された承継人および譲受人を拘束し、その利益のために効力を生じます。権利放棄は放棄する当事者の授権代表者が署名しなければならず、行為から黙示することはできません。このMNDAのいずれかの規定が執行不能と判断される場合、MNDAの残りの部分が効力を維持できるよう必要最小限の範囲に限定されます。このMNDA（表紙を含む）は、その主題に関する当事者間の完全な合意を構成し、かかる主題に関する事前および同時期のすべての理解、合意、表明、および保証（書面または口頭）に優先します。このMNDAは、両当事者が署名した書面による合意によってのみ修正、変更、放棄、または補足することができます。このMNDAに基づく通知、要求、承認は、表紙上のメールまたは郵便宛先に書面で送付しなければならず、受領時に配送されたものとみなされます。このMNDAは、各正本が原本とみなされ、全正本を合わせると同一の合意を形成する副本で実行することができます。
          </li>
        </ol>

        <p className="footer-note">
          Common Paper 相互秘密保持契約 バージョン1.0 は CC BY 4.0 の下で無償利用可能。
        </p>
      </section>
    </div>
  );
});

MNDADocument.displayName = "MNDADocument";

export default MNDADocument;
