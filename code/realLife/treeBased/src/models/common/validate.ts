import { z } from 'zod'

export function validate<T>(value: T, schema: z.Schema): T {
    try {
        return schema.parse(value)
    } catch (error) {
        if (!(error instanceof z.ZodError)) throw error
        throw new Error(formatZodError(error))
    }
}

function formatZodError(error: z.ZodError) {
    return JSON.stringify(error.format())
        .replaceAll('"_errors":[]', '')
        .replaceAll('{,', '{')
        .replaceAll(',}', '}')
        .replaceAll('"_errors":', '')
        .replaceAll(new RegExp('{\\["([^"]*)"\\]}', 'g'), '"$1"')
}
