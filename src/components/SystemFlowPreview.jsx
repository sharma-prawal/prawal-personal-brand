import bankingPayments from "../assets/banking-payments-flow.svg";
import dataRefinery from "../assets/data-refinery-flow.svg";

const diagrams = {
  "data-refinery": {
    src: dataRefinery,
    alt: "Data Refinery ingests feeds from Facebook, Google, and other sources, cleans and enriches the data, and delivers it to storage and business intelligence tools."
  },
  "banking-payments": {
    src: bankingPayments,
    alt: "The ACH lifecycle starts with enrollment and identity checks, then moves through payment, fraud scoring, and settlement and returns."
  }
};

export default function SystemFlowPreview({ diagram }) {
  const { src, alt } = diagrams[diagram];
  return (
    <div className="system-flow-preview">
      <img src={src} alt={alt} width="328" height="146" />
    </div>
  );
}
