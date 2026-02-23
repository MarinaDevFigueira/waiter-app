import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button/button";
import { feedbackScreenVariants } from "./variants";

interface FeedbackScreenProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof feedbackScreenVariants> {
  illustration?: React.ReactNode | string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  onAction?: () => void;
}

const FeedbackScreen = React.forwardRef<HTMLDivElement, FeedbackScreenProps>(
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
    const buttonVariant = isSuccess ? "outline" : "default";

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
            data-issuccess={isSuccess}
            className="text-2xl font-bold data-[issuccess=true]:text-white data-[issuccess=false]:text-foreground"
          >
            {title}
          </h1>
        )}

        {description && (
          <p
            data-testid="feedback-description"
            data-issuccess={isSuccess}
            className="text-sm data-[issuccess=true]:text-white/80 data-[issuccess=false]:text-muted-foreground"
          >
            {description}
          </p>
        )}

        {children}

        {action && (
          <Button
            data-testid="feedback-action"
            onClick={onAction}
            variant={buttonVariant}
            className="mt-4 min-w-[120px]"
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
