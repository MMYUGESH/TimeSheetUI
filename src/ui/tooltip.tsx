import { cn } from "@frontend/lib/utils";
import {
  Content as TooltipPrimitiveContent,
  Portal as TooltipPrimitivePortal,
  Provider as TooltipPrimitiveProvider,
  Root as TooltipPrimitiveRoot,
  Trigger as TooltipPrimitiveTrigger,
} from "@radix-ui/react-tooltip";
import React from "react";

const TooltipProvider = TooltipPrimitiveProvider;

const Tooltip = TooltipPrimitiveRoot;

const TooltipTrigger = TooltipPrimitiveTrigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitiveContent>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitiveContent>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitivePortal>
    <TooltipPrimitiveContent
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </TooltipPrimitivePortal>
));
TooltipContent.displayName = TooltipPrimitiveContent.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
