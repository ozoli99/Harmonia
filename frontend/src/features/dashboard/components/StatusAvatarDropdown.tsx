import React from "react";
import { motion } from "framer-motion";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export const Statuses = ["Available", "Busy", "Offline"] as const;
export type StatusType = (typeof Statuses)[number];

interface Props {
    userImageUrl?: string;
    currentStatus: StatusType;
    onStatusChange: (status: string) => void;
    onOpenCustomStatus: () => void;
    onOpenStatusCenter: () => void;
}

export const StatusAvatarDropdown: React.FC<Props> = ({
    userImageUrl,
    currentStatus,
    onStatusChange,
    onOpenCustomStatus,
    onOpenStatusCenter,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button
                        className="relative w-14 h-14 rounded-full border-2 border-border shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        aria-label="Change status">
                        <img
                            src={
                                userImageUrl ?? "https://via.placeholder.com/50"
                            }
                            alt="Avatar"
                            className="w-full h-full rounded-full object-cover"
                        />
                        <span
                            className={`
                                absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-surfaceDark ${
                                    currentStatus === "Available"
                                        ? "bg-success animate-soft-pulse"
                                        : currentStatus === "Busy"
                                        ? "bg-danger"
                                        : "bg-muted"
                                }
                            `}
                        />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content
                    align="start"
                    sideOffset={8}
                    className="z-50 min-w-[180px] p-1 theme-panel rounded-xl shadow-md">
                    {Statuses.map((status) => (
                        <DropdownMenu.Item
                            key={status}
                            onClick={() => onStatusChange(status)}
                            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-muted transition-colors">
                            <span
                                className={`w-2.5 h-2.5 rounded-full ${
                                    status === "Available"
                                        ? "bg-success"
                                        : status === "Busy"
                                        ? "bg-danger"
                                        : "bg-muted"
                                }`}
                            />
                            {status}
                        </DropdownMenu.Item>
                    ))}

                    <DropdownMenu.Separator className="h-px bg-muted my-1" />

                    <DropdownMenu.Item
                        onClick={onOpenCustomStatus}
                        className="px-3 py-2 text-sm text-primary hover:bg-muted rounded-md cursor-pointer">
                        ✏️ Set custom status…
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                        onClick={onOpenStatusCenter}
                        className="px-3 py-2 text-sm text-muted hover:bg-muted rounded-md cursor-pointer">
                        🧠 Status Center
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </motion.div>
    );
};
