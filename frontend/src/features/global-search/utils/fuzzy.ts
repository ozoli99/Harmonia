import Fuse from "fuse.js";
import { Item, FilterOption, SearchCategory } from "../types/globalSearch";

export function createFuse(items: Item[]) {
    return new Fuse(items, { keys: ["item"], threshold: 0.4 });
}

export function filterResults(
    fuse: Fuse<Item>,
    query: string,
    filter: FilterOption
) {
    const matched = fuse
        .search(query)
        .map((res) => res.item)
        .filter((item) => filter === "All" || item.category === filter);

    const grouped = matched.reduce((acc, curr) => {
        const group = acc.find((g) => g.category === curr.category);
        group
            ? group.items.push(curr.item)
            : acc.push({ category: curr.category, items: [curr.item] });
        return acc;
    }, [] as { category: SearchCategory; items: string[] }[]);

    return grouped;
}
