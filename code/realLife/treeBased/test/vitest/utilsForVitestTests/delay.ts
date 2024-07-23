export async function delay(ms: number): Promise<void> {
    // This is mostly used during tests to let other promises resolve by switching threads.
    return new Promise((resolve) => setTimeout(resolve, ms))
}
