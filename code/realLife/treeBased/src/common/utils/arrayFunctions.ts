import { ClassWithId } from '../../models/common/ClassWithId'
import { domainId } from '../../models/common/domainId'

export function getArrayIntersection<T>(array1: Array<T>, array2: Array<T>): Array<T> {
    return array1.filter((el) => array2.includes(el))
}

export function getArrayDiff(array1: Array<unknown>, array2: Array<unknown>): Array<unknown> {
    return array1
        .filter((a1) => !array2.find((a2) => a2 === a1))
        .concat(array2.filter((a2) => !array1.find((a1) => a1 === a2)))
}

export function getArrayUnique<T>(array: Array<T>): Array<T> {
    return [...new Set(array)]
}

export function sameMembers(arr1: unknown[], arr2: unknown[]) {
    const set1 = new Set(arr1)
    const set2 = new Set(arr2)
    return arr1.every((item) => set2.has(item)) && arr2.every((item) => set1.has(item))
}

/** @see https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function asyncForEach(
    array: Array<unknown>,
    callback: (arrayItem: any, index?: number, array?: Array<unknown>) => Promise<unknown>,
) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

/** Replaces the item in the array by given identity function, otherwise adds it to the items. */
export function replaceOrAddArrayValue<T extends ClassWithId>(
    items: Array<T>,
    newItem: T,
    idFunction: (item: T) => domainId = (item) => item.id,
) {
    const foundItem = items.find((item) => idFunction(item) === idFunction(newItem))
    const index = foundItem ? items.indexOf(foundItem) : -1
    if (index >= 0) {
        items[index] = newItem
    } else {
        items.push(newItem)
    }
}

/**
 * sorts an unsorted array by the sorting of a sorted array in place.
 * The sorted array must have all values of the unsorted array to work correctly
 */
export function sortArrayByOtherArray<T>(arrayToSort: Array<T>, sortedArray: Array<T>): void {
    arrayToSort.sort((x, y) => sortedArray.indexOf(x) - sortedArray.indexOf(y))
}

/**
 * Removes elements of one array that are not part of another in place
 */
export function removeUnknownElementsFromArray<T>(arrayWithElements: Array<T>, knownElements: Array<T>): void {
    const elementsToRemove: number[] = []
    arrayWithElements.forEach((currentChoice) => {
        if (!knownElements.includes(currentChoice)) {
            elementsToRemove.push(arrayWithElements.indexOf(currentChoice))
        }
    })
    elementsToRemove.reverse()
    elementsToRemove.forEach((index) => {
        arrayWithElements.splice(index, 1)
    })
}
