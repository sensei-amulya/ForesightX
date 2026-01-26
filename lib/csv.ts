import { parse } from "csv-parse/sync";

export type ParsedMetric = {
    date: string;
    revenue: number;
    orders: number;
    customers: number;
};

export function parseCSV(buffer: Buffer): ParsedMetric[] {
    const records = parse(buffer, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });

    return records.map((row: any, index: number) => {
        if (!row.date || !row.revenue || !row.orders || !row.customers) {
            throw new Error(`Invalid row at line ${index + 2}`);
        }

        return {
            date: row.date,
            revenue: Number(row.revenue),
            orders: Number(row.orders),
            customers: Number(row.customers),
        };
    });
}
