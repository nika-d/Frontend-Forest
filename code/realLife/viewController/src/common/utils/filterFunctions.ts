export function filterWithMultipleFunctions<T>(data: T[], filterFunctions: ((data: T) => boolean)[]): T[] {
    return data.filter((data) => filterFunctions.every((filterFunction) => filterFunction(data)))
}
