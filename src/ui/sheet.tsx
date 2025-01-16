"use client";

import { cn } from "@frontend/lib/utils";
import {
  Close as SheetPrimitiveClose,
  Content as SheetPrimitiveContent,
  Description as SheetPrimitiveDescription,
  Overlay as SheetPrimitiveOverlay,
  Portal as SheetPrimitivePortal,
  Root as SheetPrimitiveRoot,
  Title as SheetPrimitiveTitle,
  Trigger as SheetPrimitiveTrigger,
} from "@radix-ui/react-dialog";
import { type VariantProps, cva } from "class-variance-authority";
import { X } from "lucide-react";
import React from "react";

const Sheet = SheetPrimitiveRoot;

const SheetTrigger = SheetPrimitiveTrigger;

const SheetClose = SheetPrimitiveClose;

const SheetPortal = SheetPrimitivePortal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitiveOverlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitiveOverlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitiveOverlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitiveOverlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitiveContent>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitiveContent>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitiveContent
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      <SheetPrimitiveClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="w-4 h-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitiveClose>
      {children}
    </SheetPrimitiveContent>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitiveContent.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitiveTitle>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitiveTitle>
>(({ className, ...props }, ref) => (
  <SheetPrimitiveTitle
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitiveTitle.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitiveDescription>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitiveDescription>
>(({ className, ...props }, ref) => (
  <SheetPrimitiveDescription
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitiveDescription.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
