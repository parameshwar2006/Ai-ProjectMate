import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  glow = false,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'glass-card rounded-2xl p-6 transition-all duration-300 relative',
          hover && 'hover:border-slate-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5',
          glow && 'before:absolute before:-inset-px before:rounded-2xl before:bg-gradient-to-r before:from-blue-500/20 before:to-purple-500/20 before:-z-10',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
