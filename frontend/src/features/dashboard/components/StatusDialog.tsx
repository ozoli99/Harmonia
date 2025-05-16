import React, { Suspense } from "react";
import { Button, Dialog } from "kaida-ui";
import { Theme as EmojiTheme } from "emoji-picker-react";

const EmojiPicker = React.lazy(() => import("emoji-picker-react"));

interface Props {
    open: boolean;
    tempStatus: string;
    showEmojiPicker: boolean;
    isDark: boolean;
    onTempStatusChange: (val: string) => void;
    onToggleEmojiPicker: () => void;
    onSave: () => void;
    onClose: () => void;
    suggestions?: string[];
    recent?: string[];
    onSetSuggestion?: (status: string) => void;
}

const StatusDialog: React.FC<Props> = ({
    open,
    tempStatus,
    showEmojiPicker,
    isDark,
    onTempStatusChange,
    onToggleEmojiPicker,
    onSave,
    onClose,
    suggestions = [],
    recent = [],
    onSetSuggestion,
}) => {
    return (
        <Dialog
            open={open}
            onOpenChange={onClose}
            contentClassName="p-6 w-[90vw] max-w-md md:max-w-lg max-h-[90vh] space-y-6">
            <Dialog.Title className="text-lg font-semibold theme-heading">
                Set Custom Status
            </Dialog.Title>

            <input
                autoFocus
                type="text"
                value={tempStatus}
                onChange={(e) => onTempStatusChange(e.target.value)}
                maxLength={50}
                placeholder="E.g. 😊 Out for lunch, WFH..."
                className="w-full px-3 py-2 border border-border rounded-md bg-white dark:bg-surfaceDark text-sm"
            />

            <div className="flex justify-between items-center text-xs">
                <Button size="sm" variant="ghost" onClick={onToggleEmojiPicker}>
                    😊 Pick Emoji
                </Button>
                <span className="theme-subtext">{tempStatus.length}/50</span>
            </div>

            {showEmojiPicker && (
                <div className="max-h-[250px] overflow-y-auto rounded border border-border shadow bg-white dark:bg-surfaceDark">
                    <Suspense
                        fallback={
                            <div className="text-sm theme-subtext px-2 py-1">
                                Loading emoji picker…
                            </div>
                        }>
                        <EmojiPicker
                            theme={
                                isDark
                                    ? ("dark" as EmojiTheme)
                                    : ("light" as EmojiTheme)
                            }
                            onEmojiClick={(emojiObject) => {
                                const emoji = emojiObject.emoji;
                                const newValue = tempStatus.startsWith(emoji)
                                    ? tempStatus
                                    : `${emoji} ${tempStatus}`;
                                onTempStatusChange(newValue);
                                onToggleEmojiPicker();
                            }}
                        />
                    </Suspense>
                </div>
            )}

            {(suggestions.length > 0 || recent.length > 0) && (
                <div className="space-y-4">
                    {suggestions.length > 0 && (
                        <div>
                            <p className="text-xs uppercase tracking-wide theme-subtext font-medium mb-1">
                                Suggested
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((sug) => (
                                    <Button
                                        key={sug}
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => onSetSuggestion?.(sug)}>
                                        {sug}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                    {recent.length > 0 && (
                        <div>
                            <p className="text-xs uppercase tracking-wide theme-subtext font-medium mb-1">
                                Recent
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {recent.map((r) => (
                                    <Button
                                        key={r}
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onSetSuggestion?.(r)}>
                                        {r}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button variant="ghost" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={onSave}>Save</Button>
            </div>
        </Dialog>
    );
};

export default StatusDialog;
