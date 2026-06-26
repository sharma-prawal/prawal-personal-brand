export const premiumEase = [0.16, 1, 0.3, 1];
export const exitEase = [0.7, 0, 0.84, 0];

export const fadeUp = {
  hidden: { opacity: 0, y: 22, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" }
};

export const stagger = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.08,
      staggerChildren: 0.09
    }
  }
};

// Cinematic page transition — clean slide + opacity, no blur jank
export const pageEntrance = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.18, ease: [0.7, 0, 0.84, 0] } }
};

export const itemReveal = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" }
};

export const cardHover = {
  y: -4,
  scale: 1.004,
  transition: { duration: 0.24, ease: premiumEase }
};

export const tapPress = {
  scale: 0.985,
  transition: { duration: 0.12, ease: premiumEase }
};

export const viewportReveal = { once: true, amount: 0.04, margin: "0px 0px -4% 0px" };

// Split-slide — opposing horizontal entries for two-column layouts
export const slideLeft = {
  hidden: { opacity: 0, x: -28, filter: "blur(4px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)" }
};
export const slideRight = {
  hidden: { opacity: 0, x: 28, filter: "blur(4px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)" }
};

// Scale reveal — cinematic entrance for featured hero cards
export const scaleReveal = {
  hidden: { opacity: 0, scale: 0.97, filter: "blur(6px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)" }
};

// Row reveal — horizontal slide for list/archive rows (no blur for perf)
export const rowReveal = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0 }
};

// Split stagger container — coordinates left/right children
export const splitStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

// Row stagger — faster cadence for archive lists
export const rowStagger = {
  hidden: {},
  visible: { transition: { delayChildren: 0.04, staggerChildren: 0.055 } }
};

// Hero headline word-by-word clip-path reveal
export const heroWordContainer = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.1, staggerChildren: 0.055 }
  }
};

export const heroWord = {
  hidden: { y: "115%" },
  visible: {
    y: "0%",
    transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] }
  }
};
