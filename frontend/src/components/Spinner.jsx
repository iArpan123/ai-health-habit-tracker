import React from "react";
export default function Spinner({ size = 18 }) {
  return <span className="spinner" style={{ width: size, height: size, borderWidth: Math.max(2, size/9) }} />;
}
