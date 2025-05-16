import React from "react";
import { Bell, CalendarDays, PlusCircle, UserPlus } from "lucide-react";
import GlobalSearch from "@features/global-search/components/GlobalSearch";
import {
    DarkModeToggle,
    SplitButton,
    LanguageSwitcher,
    Button,
} from "kaida-ui";
import * as Tooltip from "@radix-ui/react-tooltip";
import i18n from "@app/i18n";

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
                <LanguageSwitcher
                    currentLanguage="en"
                    onChange={(language) => i18n.changeLanguage(language)}
                    languages={[
                        { code: "en", label: "English", flag: "🇬🇧" },
                        { code: "hu", label: "Magyar", flag: "🇭🇺" },
                        { code: "es", label: "Español", flag: "🇪🇸" },
                    ]}
                />
                <DarkModeToggle isDark={isDark} onToggle={onToggleDark} />

                <Tooltip.Provider>
                    <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    icon={<Bell className="w-5 h-5" />}
                                    aria-label="Notifications"
                                    onClick={() => {
                                        /*…*/
                                    }}
                                />
                                {notificationsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-danger text-inverted text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
                                        {notificationsCount}
                                    </span>
                                )}
                            </div>
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
