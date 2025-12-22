import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button/button";
import feedbackScreenVariants from "./variants";

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
    ref,
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
          <div
            data-testid="feedback-illustration"
            className="flex items-center justify-center"
          >
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
            data-isSuccess={isSuccess}
            className="text-2xl font-bold data-[isSuccess=true]:text-white data-[isSuccess=false]:text-foreground"
          >
            {title}
          </h1>
        )}

        {description && (
          <p
            data-testid="feedback-description"
            data-isSuccess={isSuccess}
            className="text-sm data-[isSuccess=true]:text-white/80 data-[isSuccess=false]:text-muted-foreground"
          >
            {description}
          </p>
        )}

        {children}

        {action && (
          <Button
            data-testid="feedback-action"
            data-isSuccess={isSuccess}
            onClick={onAction}
            className="mt-4 min-w-[120px] data-[isSuccess=true]:bg-white data-[isSuccess=true]:text-primary data-[isSuccess=true]:hover:bg-white/90 data-[isSuccess=false]:bg-primary data-[isSuccess=false]:hover:bg-primary/90 data-[isSuccess=false]:text-white"
          >
            {action}
          </Button>
        )}
      </div>
    );
  },
);

FeedbackScreen.displayName = "FeedbackScreen";

export default FeedbackScreen;
export { FeedbackScreen };
