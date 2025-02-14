import React from "react";
import { motion } from "framer-motion";
import classNames from "classnames";

export interface ClientBadgeProps {
    tag: string;
    onClick: (e: React.MouseEvent) => void;
}

const ClientBadge: React.FC<ClientBadgeProps> = ({ tag, onClick }) => {
    const badgeClass = classNames(
        "absolute top-1 left-1 text-xs px-3 py-1 rounded-full font-medium text-white shadow-lg z-10 cursor-pointer",
        {
            "bg-yellow-500/90": tag === "VIP",
            "bg-green-500/90": tag === "Frequent",
            "bg-blue-500/90": tag !== "VIP" && tag !== "Frequent",
        }
    );

    return (
        <motion.span
            className={badgeClass}
            whileHover={{ scale: 1.1 }}
            onClick={onClick}>
            {tag}
        </motion.span>
    );
};

export default React.memo(ClientBadge);
