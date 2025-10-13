import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

interface SpinnerProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * A loading spinner component with rotation animation.
 *
 * This component renders an animated SVG spinner that can be used to indicate
 * loading states throughout the application. It accepts all standard SVG props
 * and includes a data-testid for testing purposes.
 *
 * @param props - Component props
 * @param props.className - Optional CSS classes to customize appearance
 * @param props.props - Additional SVG element props
 * @returns JSX element representing an animated loading spinner
 */
export default function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <svg
      className={cn(
        "stroke-primary mr-2 inline size-4 animate-spin",
        className
      )}
      data-testid="spinner"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
