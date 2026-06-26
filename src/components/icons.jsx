// Premium custom icon set — bespoke SVG marks replacing generic Lucide icons
// where decorative/branding precision matters most.

// Replaces ShieldCheck — thin circle + precise angular check, more architectural than a shield
export function VerifyCircle({ size = 16, className, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.5" />
      <polyline points="5.25,8.5 7.25,10.5 10.75,5.75" />
    </svg>
  );
}

// Replaces Quote — Cormorant Garamond opening double quote rendered as text glyph
// More typographic and editorial than a generic icon
export function QuoteMark({ size = 48, className, style }) {
  return (
    <span
      className={className}
      style={{
        fontFamily: "var(--font-display)",
        fontSize: size,
        lineHeight: 0.8,
        fontStyle: "italic",
        fontWeight: 300,
        display: "inline-block",
        letterSpacing: "-0.04em",
        userSelect: "none",
        ...style,
      }}
      aria-hidden="true"
    >
      &ldquo;
    </span>
  );
}

// Replaces BrainCircuit — a minimal orbital/circuit mark for AI contexts
export function OrbitMark({ size = 20, className, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="2.5" />
      <ellipse cx="10" cy="10" rx="8" ry="4" />
      <ellipse cx="10" cy="10" rx="8" ry="4" transform="rotate(60 10 10)" />
      <ellipse cx="10" cy="10" rx="8" ry="4" transform="rotate(120 10 10)" />
    </svg>
  );
}

// Replaces Network — precise connection nodes for architecture/systems contexts
export function NodeMark({ size = 20, className, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <circle cx="10" cy="4" r="2" />
      <circle cx="3" cy="16" r="2" />
      <circle cx="17" cy="16" r="2" />
      <line x1="10" y1="6" x2="3.8" y2="14.2" />
      <line x1="10" y1="6" x2="16.2" y2="14.2" />
      <line x1="5" y1="16" x2="15" y2="16" />
    </svg>
  );
}

// Replaces Sparkles — a precise four-pointed star mark, more refined than the burst shape
export function StarMark({ size = 16, className, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <line x1="8" y1="1" x2="8" y2="15" />
      <line x1="1" y1="8" x2="15" y2="8" />
      <line x1="3.05" y1="3.05" x2="12.95" y2="12.95" />
      <line x1="12.95" y1="3.05" x2="3.05" y2="12.95" />
    </svg>
  );
}

// Replaces BookOpenCheck — a minimal open book + check mark
export function DocCheck({ size = 18, className, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M9 3.5 C9 3.5 6 2.5 3 3.5 L3 15 C6 14 9 15 9 15 C9 15 12 14 15 15 L15 3.5 C12 2.5 9 3.5 9 3.5Z" />
      <line x1="9" y1="3.5" x2="9" y2="15" />
      <polyline points="6.5,9.5 8,11 11.5,7.5" />
    </svg>
  );
}

// Replaces BriefcaseBusiness — thin architectural briefcase
export function WorkMark({ size = 18, className, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <rect x="2" y="7" width="14" height="9" rx="1" />
      <path d="M6 7 L6 5 C6 3.9 6.9 3 8 3 L10 3 C11.1 3 12 3.9 12 5 L12 7" />
      <line x1="2" y1="12" x2="16" y2="12" />
    </svg>
  );
}

// Replaces ExternalLink / ArrowUpRight — thin diagonal arrow, more refined
export function DiagArrow({ size = 14, className, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <line x1="3" y1="11" x2="11" y2="3" />
      <polyline points="5,3 11,3 11,9" />
    </svg>
  );
}

// Replaces Download — thin downward arrow into a line
export function DownloadMark({ size = 16, className, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <line x1="8" y1="2" x2="8" y2="11" />
      <polyline points="5,8.5 8,12 11,8.5" />
      <line x1="2.5" y1="14" x2="13.5" y2="14" />
    </svg>
  );
}

// Replaces CheckCircle2 — thin circle + minimal check
export function CheckCircleMark({ size = 16, className, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.5" />
      <polyline points="5.5,8.5 7.25,10.5 10.75,5.75" />
    </svg>
  );
}

// Replaces MapPin — a minimal location dot with outer ring
export function LocationDot({ size = 16, className, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <circle cx="8" cy="7" r="2.5" />
      <path d="M8 2 C5.2 2 3 4.2 3 7 C3 10.5 8 14 8 14 C8 14 13 10.5 13 7 C13 4.2 10.8 2 8 2Z" />
    </svg>
  );
}

// Replaces FileText — thin document with lines
export function DocMark({ size = 16, className, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M3 2 L9.5 2 L13 5.5 L13 14 L3 14 Z" />
      <polyline points="9.5,2 9.5,5.5 13,5.5" />
      <line x1="5.5" y1="8.5" x2="10.5" y2="8.5" />
      <line x1="5.5" y1="11" x2="10.5" y2="11" />
    </svg>
  );
}
