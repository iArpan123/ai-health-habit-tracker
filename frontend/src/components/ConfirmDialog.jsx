import React from "react";

export default function ConfirmDialog({ open, title, description, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onClose }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.5)",
      display: "grid", placeItems: "center", zIndex: 40
    }}>
      <div className="card" style={{ width: 420, padding: 20 }}>
        <div className="v-stack">
          <div style={{ fontWeight: 700, fontSize: 18 }}>{title}</div>
          {description ? <div className="subtle">{description}</div> : null}
          <div className="h-stack" style={{ justifyContent: "flex-end", marginTop: 6 }}>
            <button className="btn-ghost" onClick={onClose}>{cancelText}</button>
            <button className="btn btn-danger" onClick={onConfirm}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
