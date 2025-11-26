import * as React from 'react';
import { classNames } from '~/utils/classNames';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={classNames(
        'rounded-2xl border border-white/10 bg-white/5 dark:bg-slate-900/70 backdrop-blur-md shadow-[0_20px_80px_-30px_rgba(124,58,237,0.45)]',
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={classNames('px-6 pt-6 pb-2 flex flex-col gap-2', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={classNames('text-lg font-semibold leading-tight text-white', className)} {...props} />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={classNames('text-sm text-white/70 leading-relaxed', className)} {...props} />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={classNames('px-6 pb-4', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={classNames('px-6 pb-6 pt-2', className)} {...props} />;
}
