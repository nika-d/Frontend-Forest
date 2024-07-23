import { type ResponseType } from './ResponseType'

export default function (response: ResponseType) {
    return new Promise<Response>((resolve) => {
        setTimeout(() => {
            resolve(new Response(JSON.stringify(response)))
        }, 0) // in case you want to fake api response delay, increase timeout here.
    })
}
