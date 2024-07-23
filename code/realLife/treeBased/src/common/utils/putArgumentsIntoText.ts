/**
 * Puts given arguments into a text, replacing the %s occurences in the string
 * This implements the sprintf pattern, it can be used like sprintf
 */
export default function (text: string, ...args: string[]) {
    let i = 0
    return text.replace(/%s/g, function () {
        return args[i++]
    })
}
