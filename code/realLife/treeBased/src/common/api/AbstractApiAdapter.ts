import { type JSONValue } from './JSON'

export abstract class AbstractApiAdapter {
    public abstract httpCall(
        path: string,
        method: string,
        parameters: JSONValue | null,
        headers?: Record<string, string>,
        withCookie?: boolean,
    ): Promise<Response>
}
