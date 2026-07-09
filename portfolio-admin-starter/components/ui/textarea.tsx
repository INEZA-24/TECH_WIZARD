import * as React from 'react';
import { cn } from '../../lib/utils';

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn('min-h-28 w-full rounded-xl border border-input bg-secondary/60 px-3 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20', className)} {...props} />;
}
