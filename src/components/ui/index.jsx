import React from "react";

export function Card({ children, className = "" }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`card-content ${className}`}>{children}</div>;
}

export function Button({ children, onClick, variant = "solid", className = "" }) {
  const baseClass = "button";
  const variantClass = variant === "outline" ? "outline" : "";
  return (
    <button onClick={onClick} className={`${baseClass} ${variantClass} ${className}`}>
      {children}
    </button>
  );
}

export function Input({ value, onChange, placeholder, type = "text", className = "" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`input ${className}`}
    />
  );
}

export function Calendar({ selected, onSelect, className = "" }) {
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  return (
    <input
      type="date"
      value={formatDate(selected)}
      onChange={(e) => onSelect(new Date(e.target.value))}
      className={`calendar ${className}`}
    />
  );
}