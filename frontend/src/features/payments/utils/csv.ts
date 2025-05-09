export function exportToCsv(filename: string, rows: object[]) {
    const header = Object.keys(rows[0]).join(",");
    const data = rows.map((row) =>
        Object.values(row)
            .map((val) => `"${String(val).replace(/"/g, '""')}"`)
            .join(",")
    );

    const csv = [header, ...data].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
