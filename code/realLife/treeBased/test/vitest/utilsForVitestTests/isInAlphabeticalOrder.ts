export function isInAlphabeticalOrder(a: Array<string>) {
    let notInOrder = false
    let i = 0
    while (i++ < a.length - 1) notInOrder = notInOrder || a[i - 1] > a[i]
    return !notInOrder
}
