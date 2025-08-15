import { Button } from '@/components/ui/button';
import { ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface GradientButtonProps extends ButtonProps {
  gradient?: 'primary' | 'secondary' | 'accent';
}

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, gradient = 'primary', ...props }, ref) => {
    return (
      <Button
        className={cn(
          "relative overflow-hidden border-0 text-white shadow-lg hover:shadow-xl transition-all duration-300",
          gradient === 'primary' && "bg-gradient-to-r from-primary to-accent",
          gradient === 'secondary' && "bg-gradient-to-r from-secondary to-muted",
          gradient === 'accent' && "bg-gradient-to-r from-accent to-success",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

GradientButton.displayName = "GradientButton";

export { GradientButton };