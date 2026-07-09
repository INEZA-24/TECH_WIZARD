import * as React from 'react';
import { cn } from '../../lib/utils';

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-2xl border border-border bg-card/80 p-6 shadow-2xl shadow-black/10 backdrop-blur', className)} {...props} />;
}
