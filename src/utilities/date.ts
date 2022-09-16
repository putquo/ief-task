export function addMonthsToNow(months: number): number {
    const now = new Date();
    return Math.floor(now.setMonth(now.getMonth() + months) / 1000);
}

export function toUnixTimestamp(date: number): number {
    return Math.floor(date / 1000);
}
