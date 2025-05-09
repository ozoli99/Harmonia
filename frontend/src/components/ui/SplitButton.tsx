import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "kaida-ui";
import { ChevronDown } from "lucide-react";

type SplitButtonProps = {
    primaryLabel: string;
    onPrimaryClick?: () => void;
    dropdownItems: {
        label: string;
        icon?: React.ReactNode;
        onClick: () => void;
    }[];
};

const SplitButton: React.FC<SplitButtonProps> = ({
    primaryLabel,
    onPrimaryClick,
    dropdownItems,
}) => (
    <div className="flex items-center rounded-md overflow-hidden border border-border shadow-sm">
        <Button
            onClick={onPrimaryClick}
            variant="default"
            className="rounded-none rounded-l-md"
            disabled={!onPrimaryClick}>
            {primaryLabel}
        </Button>

        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <Button
                    variant="ghost"
                    className="rounded-none rounded-r-md px-2"
                    aria-label="More actions">
                    <ChevronDown className="w-4 h-4" />
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="end"
                    sideOffset={4}
                    className="min-w-[200px] z-50 bg-white dark:bg-surfaceDark border border-border rounded-md shadow-lg p-1 animate-dropdown-in data-[state=closed]:animate-dropdown-out">
                    {dropdownItems.map((item, i) => (
                        <DropdownMenu.Item
                            key={i}
                            onClick={item.onClick}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-muted cursor-pointer rounded-md text-sm">
                            {item.icon}
                            {item.label}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    </div>
);

export default SplitButton;
