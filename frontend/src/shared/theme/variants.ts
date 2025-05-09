import { cn } from "@shared/utils/ui/cn";

type Variant =
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "outline"
    | "ghost";

export const buttonVariants = {
    base: "inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",

    variants: {
        default: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        primary: "bg-primary text-white hover:bg-primaryHover",
        success: "bg-success text-white hover:bg-successHover",
        warning: "bg-warning text-white hover:bg-yellow-500",
        danger: "bg-danger text-white hover:bg-red-600",
        outline: "border border-border text-base hover:bg-muted/20",
        ghost: "bg-transparent hover:bg-muted/10",
    },

    sizes: {
        sm: "px-3 py-1.5 text-sm rounded-md",
        md: "px-4 py-2 text-base rounded-lg",
        lg: "px-5 py-2.5 text-base rounded-xl",
    },
};

export function getButtonClass(
    variant: Variant = "default",
    size: keyof typeof buttonVariants.sizes = "md"
) {
    return cn(
        buttonVariants.base,
        buttonVariants.variants[variant],
        buttonVariants.sizes[size]
    );
}
