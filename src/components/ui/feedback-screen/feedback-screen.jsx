import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "../button";

const feedbackScreenVariants = cva(
  "flex flex-col items-center justify-center text-center gap-6 p-6",
  {
    variants: {
      variant: {
        default: "bg-background",
        overlay: "bg-background/95 backdrop-blur-sm",
        fullscreen: "bg-background min-h-dvh w-full",
        success: "bg-primary min-h-dvh w-full",
      },
      size: {
        default: "max-w-sm",
        lg: "max-w-md",
        full: "w-full h-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const FeedbackScreen = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      illustration,
      title,
      description,
      action,
      onAction,
      children,
      ...props
    },
    ref
  ) => {
    const isSuccess = variant === "success";

    return (
      <div
        ref={ref}
        data-testid="feedback-screen"
        className={cn(feedbackScreenVariants({ variant, size, className }))}
        {...props}
      >
        {illustration && (
          <div data-testid="feedback-illustration" className="flex items-center justify-center">
            {typeof illustration === "string" ? (
              <img
                src={illustration}
                alt=""
                className="max-w-[200px] max-h-[200px] object-contain"
              />
            ) : (
              illustration
            )}
          </div>
        )}

        {title && (
          <h1
            data-testid="feedback-title"
            className={cn(
              "text-2xl font-bold",
              isSuccess ? "text-white" : "text-foreground"
            )}
          >
            {title}
          </h1>
        )}

        {description && (
          <p
            data-testid="feedback-description"
            className={cn(
              "text-sm",
              isSuccess ? "text-white/80" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
        )}

        {children}

        {action && (
          <Button
            data-testid="feedback-action"
            onClick={onAction}
            className={cn(
              "mt-4 min-w-[120px]",
              isSuccess
                ? "bg-white text-primary hover:bg-white/90"
                : "bg-primary hover:bg-primary/90 text-white"
            )}
          >
            {action}
          </Button>
        )}
      </div>
    );
  }
);

FeedbackScreen.displayName = "FeedbackScreen";

// eslint-disable-next-line react-refresh/only-export-components
export { FeedbackScreen, feedbackScreenVariants };
