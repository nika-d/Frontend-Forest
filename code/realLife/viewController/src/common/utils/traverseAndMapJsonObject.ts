// source: https://gist.github.com/sphvn/dcdf9d683458f879f593?permalink_comment_id=3752985#gistcomment-3752985
// if you want to apply the function only on a part of the json, see in cited source for introducing a scope parameter.

import type { JSONValue } from '../api/JSON'

export type MappingFunction = (value: JSONValue) => JSONValue

export default function traverseAndMapJsonObject(object: JSONValue, fn: MappingFunction): JSONValue {
    if (object === null) {
        return fn(null as unknown as JSONValue)
    } else if (['string', 'number', 'boolean'].includes(typeof object)) {
        return fn(object)
    } else if (Array.isArray(object)) {
        return object.map((arrayItem) => traverseAndMapJsonObject(arrayItem as JSONValue, fn))
    } else {
        const targetObject: JSONValue = {}
        Object.entries(object).forEach(
            ([key, value]) => (targetObject[key as keyof JSONValue] = traverseAndMapJsonObject(value, fn)),
        )
        return targetObject
    }
}
