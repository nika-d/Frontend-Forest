import sortFunctionCaseInsensitive from './sortFunctionCaseInsensitive'

export function createSortFunctionWithSpecialEntriesOnTop(
    ...specialEntries: Array<string>
): (a: string, b: string) => number {
    return function (a: string, b: string): number {
        if (specialEntries.includes(a) && !specialEntries.includes(b)) return -1
        if (specialEntries.includes(b) && !specialEntries.includes(a)) return 1
        if (specialEntries.indexOf(a) < specialEntries.indexOf(b)) return -1
        if (specialEntries.indexOf(b) < specialEntries.indexOf(a)) return 0
        return sortFunctionCaseInsensitive(a, b)
    }
}
