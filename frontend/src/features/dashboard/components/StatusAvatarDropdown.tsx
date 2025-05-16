import React from "react";
import { Avatar, Dropdown, Status, StatusDot } from "kaida-ui";

const STATUSES: Status[] = ["Available", "Busy", "Offline"];

interface StatusAvatarDropdownProps {
    userName: string;
    userImageUrl?: string;
    currentStatus: Status;
    onStatusChange: (status: Status) => void;
    onOpenCustomStatus: () => void;
    onOpenStatusCenter: () => void;
}

export const StatusAvatarDropdown: React.FC<StatusAvatarDropdownProps> = ({
    userName,
    userImageUrl,
    currentStatus,
    onStatusChange,
    onOpenCustomStatus,
    onOpenStatusCenter,
}) => (
    <Dropdown
        trigger={
            <button
                type="button"
                className="p-0 m-0 bg-transparent border-none focus:outline-none">
                <Avatar name={userName} avatarUrl={userImageUrl} size={56}>
                    <StatusDot
                        status={currentStatus}
                        animate
                        size={14}
                        className="absolute bottom-0 right-0"
                    />
                </Avatar>
            </button>
        }>
        {STATUSES.map((status) => (
            <Dropdown.Item
                key={status}
                onSelect={() => onStatusChange(status)}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md cursor-pointer data-[highlighted]:bg-muted">
                <StatusDot status={status} size={10} />
                {status}
            </Dropdown.Item>
        ))}

        <Dropdown.Separator className="h-px bg-muted my-1" />

        <Dropdown.Item
            onSelect={onOpenCustomStatus}
            className="px-3 py-2 text-sm">
            ✏️ Set custom status…
        </Dropdown.Item>
        <Dropdown.Item
            onSelect={onOpenStatusCenter}
            className="px-3 py-2 text-sm text-muted">
            🧠 Status Center
        </Dropdown.Item>
    </Dropdown>
);
