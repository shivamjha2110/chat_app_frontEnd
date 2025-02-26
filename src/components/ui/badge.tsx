import React from 'react';

export function Badge({ children, variant, className }: { children: React.ReactNode, variant: string, className: string }) {
  return <span className={`badge ${variant} ${className}`}>{children}</span>;
}
