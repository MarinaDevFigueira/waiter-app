import { cva } from "class-variance-authority";

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
  },
);

export default feedbackScreenVariants;
export { feedbackScreenVariants };
