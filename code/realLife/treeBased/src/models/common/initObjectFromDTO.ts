import { type JSONValue } from '../../common/api/JSON'
import { z } from 'zod'
import { validate } from './validate'

export function initObjectFromDTO<T extends object>(
    dto: JSONValue | object,
    object: T,
    schema: z.Schema | null = null,
    skipValues: string[] = [],
): void {
    return execute(dto, object, schema, skipValues)

    function execute(dto: JSONValue | object, object: T, schema: z.Schema | null = null, skipValues: string[] = []) {
        if (!schema) {
            Object.assign(object, dto)
            return
        }
        const strippedDTO: JSONValue | object = validate(dto, schema)

        let sourceDTO = strippedDTO
        if (skipValues) {
            sourceDTO = { ...(strippedDTO as object) }
            skipValues.forEach((key) => {
                delete sourceDTO[key as keyof object]
            })
        }

        Object.assign(object, sourceDTO)
    }
}
