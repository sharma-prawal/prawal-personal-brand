import { useLayoutEffect, useRef } from "react";

// Everything outside the dialog: its siblings, and its ancestors' siblings, up
// to <body>. showModal() already makes these inert for keyboard and screen
// readers, but tools that walk the DOM (audits, test drivers) don't apply that
// rule, so mark them inert explicitly too.
function markOutsideInert(dialog) {
  const marked = [];
  for (let node = dialog; node && node !== document.body; node = node.parentElement) {
    for (const sibling of node.parentElement?.children ?? []) {
      if (sibling === node || sibling.inert) continue;
      sibling.inert = true;
      marked.push(sibling);
    }
  }
  return marked;
}

export default function OverlayDialog({ className, label, onDismiss, returnFocusRef, children }) {
  const dialogRef = useRef(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const trigger = returnFocusRef?.current || document.activeElement;
    dialog.showModal();
    const marked = markOutsideInert(dialog);
    dialog.querySelector("[data-dialog-initial-focus]")?.focus({ preventScroll: true });
    return () => {
      // Lift inert before handing focus back, or the trigger can't take it.
      for (const element of marked) element.inert = false;
      dialog.close();
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [returnFocusRef]);

  return (
    <dialog
      ref={dialogRef}
      className={`overlay-dialog ${className}`}
      // <dialog> already has this role; stated for tools that only read the attribute.
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        onDismiss();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onDismiss();
      }}
    >
      {children}
    </dialog>
  );
}
