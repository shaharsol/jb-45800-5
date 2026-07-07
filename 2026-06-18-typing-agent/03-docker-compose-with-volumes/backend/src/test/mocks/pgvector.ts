export function toSql(value: number[]): string {
    return `[${value.join(',')}]`
}
