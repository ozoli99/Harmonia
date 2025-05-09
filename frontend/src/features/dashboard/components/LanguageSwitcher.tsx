import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Globe, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const currentLang = i18n.resolvedLanguage || i18n.language;

    const handleChange = (lang: "en" | "hu" | "es") => {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    className="flex items-center gap-1 px-2 py-1 text-sm font-medium uppercase border border-border rounded-md bg-white dark:bg-surfaceDark hover:bg-muted transition-colors"
                    aria-label="Change Language">
                    <Globe className="w-4 h-4 text-muted dark:text-mutedDark" />
                    <span>{currentLang}</span>
                    <ChevronDown className="w-3 h-3 text-muted dark:text-mutedDark opacity-60" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
                sideOffset={6}
                align="end"
                className="z-50 min-w-[120px] p-1 rounded-lg theme-panel shadow-md">
                {[
                    { code: "en", label: "English", flag: "🇬🇧" },
                    { code: "hu", label: "Magyar", flag: "🇭🇺" },
                    { code: "es", label: "Español", flag: "🇪🇸" },
                ].map(({ code, label, flag }) => (
                    <DropdownMenu.Item
                        key={code}
                        onSelect={() =>
                            handleChange(code as "en" | "hu" | "es")
                        }
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer transition-colors hover:bg-muted dark:hover:bg-muted/40">
                        <span>{flag}</span>
                        <span>{label}</span>
                    </DropdownMenu.Item>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

export default LanguageSwitcher;
