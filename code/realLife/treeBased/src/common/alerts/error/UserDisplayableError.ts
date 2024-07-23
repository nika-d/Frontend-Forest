export class UserDisplayableError extends Error {
    constructor(
        internalMessage: string,
        public readonly messageHeader: string,
        public readonly messageBody: string,
        public readonly link: string | null = null,
        public readonly statusCode: number | null = null,
    ) {
        super(internalMessage)
    }
}
