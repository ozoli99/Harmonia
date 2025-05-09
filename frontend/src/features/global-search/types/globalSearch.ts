export type SearchCategory = "Appointments" | "Clients" | "Transactions";
export type FilterOption = SearchCategory | "All";

export interface Item {
    item: string;
    category: SearchCategory;
}
