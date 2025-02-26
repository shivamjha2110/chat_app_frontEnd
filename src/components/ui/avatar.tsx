import React from 'react';
import Image from 'next/image';

export function Avatar({ children }: { children: React.ReactNode }) {
  return <div className="avatar">{children}</div>;
}

export function AvatarImage({ src }: { src: string }) {
  return <Image className="avatar-image" src={src} alt="Avatar" width={100} height={100} />;
}

export function AvatarFallback({ children, className }: { children: React.ReactNode, className: string }) {
  return <div className={`avatar-fallback ${className}`}>{children}</div>;
}
