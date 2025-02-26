import React from 'react';

export function Button({ children, type, variant, size, onClick, className }: { children: React.ReactNode, type: "button" | "reset" | "submit" | undefined, variant: string, size: string, onClick?: () => void, className?: string }) {
  return (
    <button type={type} className={`button ${variant} ${size} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
}
