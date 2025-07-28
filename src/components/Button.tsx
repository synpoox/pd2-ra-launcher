import { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "../util/components";

type ButtonVariants = "sidebar" | "minimal" | "secondary" | "outline";
type ButtonSizes = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
  size?: ButtonSizes;
  icon?: ReactNode;
  active?: boolean;
  children: ReactNode;
  className?: string;
}

const baseVariants: Record<ButtonVariants | "default", string> = {
  sidebar:
    "cursor-pointer group relative w-54 px-5 py-4 flex items-center gap-3 rounded-sm transition-all duration-200 ease-in-out",
  default:
    "group relative rounded-sm shadow bg-white/80 cursor-pointer transition-all duration-200 ease-in-out flex flex-col items-center justify-center",
  minimal:
    "cursor-pointer rounded text-gray-600 hover:text-gray-900 transition flex justify-center items-center px-4 py-2",
  secondary:
    "cursor-pointer bg-gray-200 text-gray-800 rounded hover:D-300 transition flex justify-center items-center px-4 py-2",
  outline:
    "cursor-pointer border border-gray-400 rounded hover:bg-gray-100 transition flex justify-center items-center px-4 py-2",
};

const activeVariants: Record<ButtonVariants | "default", string> = {
  sidebar: "active:bg-black/60",
  default: "active:bg-white/30",
  minimal: "active:text-gray-700",
  secondary: "active:bg-gray-400",
  outline: "active:bg-gray-200",
};

const sizeVariants: Record<ButtonSizes, string> = {
  sm: "text-sm px-3 py-1 min-w-[64px]",
  md: "text-base px-5 py-3 min-w-[96px]",
  lg: "text-lg px-6 py-4 min-w-[128px]",
};

function Button({
  variant,
  size = "md",
  icon,
  active,
  children,
  className,
  ...props
}: ButtonProps) {
  const usedVariant = variant || "default";

  const baseClass = baseVariants[usedVariant];
  const activeClass = activeVariants[usedVariant];
  const sizeClass = usedVariant === "sidebar" ? "" : sizeVariants[size];
  const sidebarBg =
    usedVariant === "sidebar"
      ? active
        ? "bg-black/10"
        : "bg-transparent hover:bg-white/10"
      : "";

  const disabledClass = props.disabled && "opacity-30 pointer-events-none";

  return (
    <button
      className={cn(
        baseClass,
        sizeClass,
        activeClass,
        sidebarBg,
        disabledClass,
        className
      )}
      {...props}
    >
      {(usedVariant === "sidebar" || usedVariant === "default") && (
        <span
          className={cn(
            "absolute rounded-sm border transition-all duration-200 ease-in-out pointer-events-none",
            usedVariant === "sidebar"
              ? active
                ? "inset-[0px] border-gray-100/20"
                : "border-transparent group-hover:inset-[4px] group-hover:border-gray-100/20"
              : "inset-0 border border-black/40 group-hover:border-3"
          )}
        />
      )}

      {icon && (
        <span
          className={cn(
            usedVariant === "sidebar" ? "relative z-10" : "mb-1 z-10"
          )}
        >
          {icon}
        </span>
      )}

      <p
        className={cn(
          "relative z-10 font-semibold",
          usedVariant === "sidebar"
            ? "text-lg text-white text-left"
            : "text-lg text-center text-brown-800"
        )}
      >
        {children}
      </p>
    </button>
  );
}

export default Button;
