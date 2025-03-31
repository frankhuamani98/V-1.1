import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/* ---------------------------------- Types --------------------------------- */
export interface CommandProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof commandVariants> {
  onOptionSelect?: (value: string) => void;
  disabled?: boolean;
}

export interface CommandGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
}

export interface CommandItemProps {
  onSelect?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/* -------------------------------- Variants -------------------------------- */
const commandVariants = cva(
  'bg-popover text-popover-foreground rounded-lg border shadow-md',
  {
    variants: {
      size: {
        sm: 'p-1 text-sm',
        md: 'p-2 text-base',
        lg: 'p-3 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

/* ------------------------------- Components ------------------------------- */
const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ className, size, onOptionSelect, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        {...(props as React.HTMLAttributes<HTMLDivElement>)}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { onOptionSelect } as any);
          }
          return child;
        })}
      </div>
    );
  }
);

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, heading, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('py-1 px-2 space-y-1', className)}
        {...props}
      >
        {heading && (
          <h3 className="text-xs font-medium text-muted-foreground px-2 py-1">
            {heading}
          </h3>
        )}
        <div className="space-y-0.5">{children}</div>
      </div>
    );
  }
);

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, onSelect, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'px-3 py-1.5 text-sm rounded-md cursor-pointer',
          'hover:bg-accent hover:text-accent-foreground',
          'transition-colors duration-200',
          'flex items-center gap-2',
          className
        )}
        onClick={() => onSelect?.((children as string) || '')}
        {...props}
      >
        {children}
      </div>
    );
  }
);

/* --------------------------- CommandExample --------------------------- */
interface CommandExampleProps extends CommandProps {
  options?: {
    value: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
  }[];
  groupHeading?: string;
}

const CommandExample = React.forwardRef<HTMLDivElement, CommandExampleProps>(
  (
    {
      options = [
        { value: 'opcion1', label: 'Opción 1' },
        { value: 'opcion2', label: 'Opción 2' },
        { value: 'opcion3', label: 'Opción 3' },
      ],
      groupHeading = 'Opciones',
      className,
      onOptionSelect,
      size,
      ...props
    },
    ref
  ) => {
    return (
      <Command
        ref={ref}
        className={cn('w-64', className)}
        size={size}
        onOptionSelect={onOptionSelect}
        {...props}
      >
        <CommandGroup heading={groupHeading}>
          {options.map((option) => (
            <CommandItem
              key={option.value}
              onSelect={() => onOptionSelect?.(option.value)}
              disabled={option.disabled}
            >
              {option.icon && <span className="w-5">{option.icon}</span>}
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    );
  }
);

export { Command, CommandGroup, CommandItem, CommandExample };
