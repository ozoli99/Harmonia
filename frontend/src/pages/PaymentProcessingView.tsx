import React, { useState } from "react";
import { CheckCircle, Clock, Download, Eye, Search } from "lucide-react";
import clsx from "clsx";
import ReceiptModal from "@features/payments/components/ReceiptModal";
import { exportToCsv } from "@features/payments/utils/csv";

interface Payment {
    id: number;
    amount: string;
    date: string;
    status: "Completed" | "Pending";
    method: "Card" | "Cash";
}

const dummyPayments: Payment[] = [
    {
        id: 1,
        amount: "$50",
        date: "2024-12-31",
        status: "Completed",
        method: "Card",
    },
    {
        id: 2,
        amount: "$70",
        date: "2024-12-15",
        status: "Pending",
        method: "Cash",
    },
    {
        id: 3,
        amount: "$80",
        date: "2024-12-05",
        status: "Completed",
        method: "Card",
    },
];

type PaymentStatus = "All" | "Completed" | "Pending";
const FILTER_OPTIONS: PaymentStatus[] = ["All", "Completed", "Pending"];

const statusStyles: Record<Payment["status"], string> = {
    Completed: "bg-green-100 text-green-800",
    Pending: "bg-yellow-100 text-yellow-800",
};

const statusIcons: Record<Payment["status"], React.ReactNode> = {
    Completed: <CheckCircle className="w-4 h-4 mr-1" />,
    Pending: <Clock className="w-4 h-4 mr-1" />,
};

const PaymentProcessingView: React.FC = () => {
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<PaymentStatus>("All");
    const [receiptOpen, setReceiptOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(
        null
    );

    const filteredPayments = dummyPayments.filter((p) => {
        const matchesQuery =
            p.amount.toLowerCase().includes(query.toLowerCase()) ||
            p.status.toLowerCase().includes(query.toLowerCase()) ||
            p.date.includes(query);
        const matchesStatus =
            statusFilter === "All" || p.status === statusFilter;
        return matchesQuery && matchesStatus;
    });

    const monthlyTotal = filteredPayments.reduce((sum, p) => {
        const amount = parseFloat(p.amount.replace(/[^0-9.]/g, ""));
        return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const openReceipt = (payment: Payment) => {
        setSelectedPayment(payment);
        setReceiptOpen(true);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                Payment History
            </h2>

            {/* Filters and Export */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-0">
                        {FILTER_OPTIONS.map((option) => (
                            <button
                                key={option}
                                onClick={() => setStatusFilter(option)}
                                className={clsx(
                                    "px-3 py-1 rounded-full text-sm border transition-all",
                                    statusFilter === option
                                        ? "bg-[#CFA15D] text-white border-transparent"
                                        : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                )}>
                                {option}
                            </button>
                        ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {filteredPayments.length} payments • Total: $
                        {monthlyTotal.toFixed(2)}
                    </p>
                </div>

                <button
                    onClick={() =>
                        exportToCsv(
                            "payments.csv",
                            filteredPayments.map((p) => ({
                                ID: p.id,
                                Date: p.date,
                                Amount: p.amount,
                                Status: p.status,
                                Method: p.method,
                            }))
                        )
                    }
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#CFA15D] hover:bg-[#b78842] rounded-lg transition">
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Search */}
            <div className="relative w-full max-w-sm mb-6">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search by amount, date, or status..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#CFA15D]"
                />
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Method
                            </th>
                            <th className="px-6 py-3 text-left text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3" />
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredPayments.length > 0 ? (
                            filteredPayments.map((payment) => (
                                <tr
                                    key={payment.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                        {new Date(
                                            payment.date
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                        {payment.amount}
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                                        {payment.method}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={clsx(
                                                "inline-flex items-center px-2 py-1 rounded-full font-semibold text-xs",
                                                statusStyles[payment.status]
                                            )}>
                                            {statusIcons[payment.status]}{" "}
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => openReceipt(payment)}
                                            className="flex items-center text-xs text-blue-600 hover:underline">
                                            <Eye className="w-4 h-4 mr-1" />
                                            View Receipt
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="text-center py-6 text-gray-500 dark:text-gray-400">
                                    No matching payments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ReceiptModal
                isOpen={receiptOpen}
                onClose={() => setReceiptOpen(false)}
                payment={selectedPayment}
            />
        </div>
    );
};

export default PaymentProcessingView;
