export default function (a: string, b: string): number {
    return a.toString().toLowerCase().localeCompare(b.toString().toLowerCase())
}
