import React from "react";
import { PencilIcon } from "@heroicons/react/24/outline";

interface NotesSectionProps {
    notes: string;
    isEditing: boolean;
    onToggleEdit: () => void;
    onChange: (value: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({
    notes,
    isEditing,
    onToggleEdit,
    onChange,
}) => {
    return (
        <div className="mt-5">
            <div className="flex justify-between items-center">
                <p className="text-[#0C1B33] dark:text-white font-medium">
                    Notes
                </p>
                <button
                    onClick={onToggleEdit}
                    className="text-[#CFA15D] hover:text-[#E1B877] transition-all">
                    <PencilIcon className="w-5 h-5" />
                </button>
            </div>
            {isEditing ? (
                <textarea
                    value={notes}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full mt-2 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1A2A4A] text-gray-900 dark:text-white"
                    rows={3}
                />
            ) : (
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {notes || "No notes added."}
                </p>
            )}
        </div>
    );
};

export default React.memo(NotesSection);
