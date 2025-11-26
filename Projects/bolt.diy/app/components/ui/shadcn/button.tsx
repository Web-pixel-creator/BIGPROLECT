import * as React from 'react';
import { classNames } from '~/utils/classNames';

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    'bg-purple-600 text-white hover:bg-purple-500 shadow-md shadow-purple-500/25 border border-transparent',
  secondary:
    'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-white/10 shadow-sm shadow-black/10',
  outline:
    'border border-white/20 text-white hover:bg-white/5 dark:text-white dark:border-white/15 dark:hover:bg-white/10',
  ghost: 'text-white hover:bg-white/5 border border-transparent',
  link: 'text-purple-400 underline-offset-4 hover:underline border border-transparent bg-transparent shadow-none',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={classNames(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
