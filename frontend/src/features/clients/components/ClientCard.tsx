import React, { useMemo } from "react";
import { UserIcon, MessageCircle, PlusCircle } from "lucide-react";
import clsx from "clsx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { Client, ClientTag } from "../types/client";
import { hasClientAlerts } from "../utils/helpers";
import ClientAppointmentInfo from "./ClientAppointmentInfo";
import { Avatar, Badge, Button, Card, CardBody, CardFooter } from "kaida-ui";
import {
    alertBadgeConfig,
    tagBadgeConfig,
} from "@features/clients/constants/tagBadgeConfig";

dayjs.extend(relativeTime);

const layoutStyles = {
    base: "transition-all rounded-xl shadow-md hover:shadow-lg border border-transparent hover:border-[#CFA15D]/50",
    grid: "p-4 flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:items-center",
    list: "w-full p-3 flex items-center gap-4 overflow-hidden",
    clickable:
        "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#CFA15D] rounded-md transition-transform hover:scale-[1.02]",
    listInner: "flex items-center gap-4 flex-grow overflow-hidden",
    gridInner: "flex items-start gap-4",
};

interface ClientCardProps {
    client: Client;
    layout: "grid" | "list";
    onView: (client: Client) => void;
    onBook: (client: Client) => void;
    onMessage: (client: Client) => void;
    setSelectedTag: React.Dispatch<React.SetStateAction<ClientTag>>;
}

const ClientCard: React.FC<ClientCardProps> = ({
    client,
    layout,
    onView,
    onBook,
    onMessage,
    setSelectedTag,
}) => {
    const lastAppointment = client.appointmentHistory.at(-1);
    const hasAlerts = useMemo(() => hasClientAlerts(client), [client]);
    const isList = layout === "list";

    const alert = alertBadgeConfig;
    const AlertIcon = alert.icon;
    const tagConfig = tagBadgeConfig[client.tag];
    const TagIcon = tagConfig.icon;

    return (
        <Card
            animated
            className={clsx(
                "bg-white dark:bg-surfaceDark",
                layoutStyles.base,
                isList ? layoutStyles.list : layoutStyles.grid
            )}
            hoverable>
            <CardBody className="p-0">
                <div
                    role="button"
                    tabIndex={0}
                    onClick={() => onView(client)}
                    onKeyDown={(e) =>
                        (e.key === "Enter" || e.key === " ") && onView(client)
                    }
                    className={clsx(
                        layoutStyles.clickable,
                        isList ? layoutStyles.listInner : layoutStyles.gridInner
                    )}>
                    <Avatar name={client.name} avatarUrl={client.avatar} />

                    <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base font-medium text-gray-800 dark:text-white truncate">
                                {client.name}
                            </h3>

                            {tagConfig && (
                                <Badge
                                    label={tagConfig.label}
                                    icon={<TagIcon className="w-3 h-3" />}
                                    variant={tagConfig.variant}
                                    onClick={() => setSelectedTag(client.tag)}
                                    title={`Filter by ${tagConfig.label}`}
                                />
                            )}

                            {hasAlerts && (
                                <Badge
                                    label={alert.label}
                                    icon={<AlertIcon className="w-3 h-3" />}
                                    variant={alert.variant}
                                    title="This client has allergies or preferences"
                                />
                            )}
                        </div>

                        {client.email && (
                            <p
                                className="text-xs text-gray-500 dark:text-gray-400 truncate"
                                title={client.email}>
                                {client.email}
                            </p>
                        )}

                        <ClientAppointmentInfo
                            lastAppointment={lastAppointment}
                        />
                    </div>
                </div>
            </CardBody>

            <CardFooter
                className={clsx(
                    isList
                        ? "flex items-center gap-1 ml-auto"
                        : "flex gap-2 justify-end"
                )}
                showBorder={false}>
                <Button
                    size="icon"
                    variant="ghost"
                    className="text-[#CFA15D] hover:bg-[#CFA15D]/10"
                    title="View Profile"
                    aria-label="View Profile"
                    onClick={() => onView(client)}>
                    <UserIcon className="w-4 h-4" />
                </Button>

                <Button
                    size="icon"
                    variant="ghost"
                    className="text-blue-500 hover:bg-blue-500/10"
                    title="Message Client"
                    aria-label="Message Client"
                    onClick={() => onMessage(client)}>
                    <MessageCircle className="w-4 h-4" />
                </Button>

                <Button
                    size="icon"
                    variant="ghost"
                    className="text-green-500 hover:bg-green-500/10"
                    title="Book Appointment"
                    aria-label="Book Appointment"
                    onClick={() => onBook(client)}>
                    <PlusCircle className="w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    );
};

export default ClientCard;
