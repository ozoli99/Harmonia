import React from "react";
import { Bell, CalendarDays, PlusCircle, UserPlus } from "lucide-react";
import GlobalSearch from "@features/global-search/components/GlobalSearch";
import { DarkModeToggle } from "kaida-ui";
import SplitButton from "@components/ui/SplitButton";
import * as Tooltip from "@radix-ui/react-tooltip";
import LanguageSwitcher from "./LanguageSwitcher";

interface Props {
    isDark: boolean;
    onToggleDark: () => void;
    onSearch: (q: string) => void;
    onNewAppointment?: () => void;
    onOpenCalendar?: () => void;
    onAddClient?: () => void;
    notificationsCount: number;
}

const TopControls: React.FC<Props> = ({
    isDark,
    onToggleDark,
    onSearch,
    onNewAppointment,
    onOpenCalendar,
    onAddClient,
    notificationsCount,
}) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full sm:w-auto">
                <GlobalSearch onSearch={onSearch} />
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <LanguageSwitcher />
                <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />

                <Tooltip.Provider>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                            <button
                                aria-label="Notifications"
                                className="relative p-2 rounded-full hover:bg-muted/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                                <Bell className="w-5 h-5 text-muted dark:text-mutedDark" />
                                {notificationsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-danger text-inverted text-xs w-4 h-4 rounded-full flex items-center justify-center leading-none font-medium">
                                        {notificationsCount}
                                    </span>
                                )}
                            </button>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                            sideOffset={6}
                            className="z-50 theme-panel text-xs px-3 py-1 shadow-md">
                            You have {notificationsCount} unread notifications
                        </Tooltip.Content>
                    </Tooltip.Root>
                </Tooltip.Provider>

                <SplitButton
                    primaryLabel="New"
                    onPrimaryClick={onNewAppointment ?? (() => {})}
                    dropdownItems={[
                        {
                            label: "New Appointment",
                            icon: <PlusCircle className="w-4 h-4" />,
                            onClick: onNewAppointment ?? (() => {}),
                        },
                        {
                            label: "Add Client",
                            icon: <UserPlus className="w-4 h-4" />,
                            onClick: onAddClient ?? (() => {}),
                        },
                        {
                            label: "Open Calendar",
                            icon: <CalendarDays className="w-4 h-4" />,
                            onClick: onOpenCalendar ?? (() => {}),
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export default TopControls;
