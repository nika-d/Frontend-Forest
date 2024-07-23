export default function (path: string, parametersNames: Array<string>): Map<string, string> {
    const parametersByNames = new Map<string, string>()
    const namesInReverseOrder = parametersNames.toReversed()
    const indexOfPersonId = parametersNames.indexOf('personId')
    let partsInReverseOrder

    if (!indexOfPersonId) {
        partsInReverseOrder = path.split('/').reverse()
    } else {
        const startIndexOfPersonId = path.indexOf('/_')
        const endIndexOfPersonId = path.indexOf(
            '_/',
            /* für Spezialfall, wenn personId mit / startet*/ startIndexOfPersonId + 2,
        )
        const partsAfterPersonId = path.slice(endIndexOfPersonId + 2).split('/')
        const partsBeforePersonId = path.slice(0, startIndexOfPersonId).split('/')
        partsInReverseOrder = [
            ...partsBeforePersonId,
            path.slice(startIndexOfPersonId + 2, endIndexOfPersonId),
            ...partsAfterPersonId,
        ].reverse()
    }

    namesInReverseOrder.forEach((name: string, index: number) => {
        parametersByNames.set(name, partsInReverseOrder[index])
    })

    return parametersByNames
}
