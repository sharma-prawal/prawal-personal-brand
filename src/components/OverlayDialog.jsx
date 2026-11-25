import { useLayoutEffect, useRef } from "react";

export default function OverlayDialog({ className, label, onDismiss, returnFocusRef, children }) {
  const dialogRef = useRef(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const trigger = returnFocusRef?.current || document.activeElement;
    dialog.showModal();
    dialog.querySelector("[data-dialog-initial-focus]")?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [returnFocusRef]);

  return (
    <dialog
      ref={dialogRef}
      className={`overlay-dialog ${className}`}
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
