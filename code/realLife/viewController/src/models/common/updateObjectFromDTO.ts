import { type JSONValue } from '../../common/api/JSON'
import { initObjectFromDTO } from './initObjectFromDTO'
import * as z from 'zod'
export function updateObjectFromDTO<T extends object>(
    dto: JSONValue | object,
    object: T,
    schema: z.Schema | null = null,
) {
    initObjectFromDTO(dto, object, schema)
}
