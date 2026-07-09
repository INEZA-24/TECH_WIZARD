import * as React from 'react';
import { cn } from '../../lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
};

const variants = {
  default: 'bg-primary text-primary-foreground shadow-glow hover:bg-primary/90',
  outline: 'border border-primary/40 bg-transparent text-primary hover:bg-primary/10',
  ghost: 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return <button className={cn('inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60', variants[variant], className)} {...props} />;
}
