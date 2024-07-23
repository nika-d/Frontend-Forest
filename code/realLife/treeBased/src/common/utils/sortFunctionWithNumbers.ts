export default function (a: string, b: string): number {
    return stringToStandardizedNumberString(a.toString())
        .toLowerCase()
        .localeCompare(stringToStandardizedNumberString(b.toString()).toLowerCase())
}

function stringToStandardizedNumberString(str: string): string {
    const firstNumberInString = str.replace(/^[^0-9]*([0-9]+)[^0-9]*.*/g, '$1')
    const firstNumberWIthLeadingZeros = String(firstNumberInString).padStart(6, '0')
    return str.replace(/^([^0-9]*)[0-9]+([^0-9]*.*)/, '$1' + firstNumberWIthLeadingZeros + '$2')
}
