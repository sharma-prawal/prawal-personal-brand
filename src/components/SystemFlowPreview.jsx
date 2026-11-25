import { ArrowRight } from "lucide-react";

export default function SystemFlowPreview({ title, steps }) {
  return (
    <ol className="home-case__flow" aria-label={`${title} system flow`}>
      {steps.map((step, index) => (
        <li key={step}>
          <span>{step}</span>
          {index < steps.length - 1 && <ArrowRight size={16} aria-hidden="true" />}
        </li>
      ))}
    </ol>
  );
}
