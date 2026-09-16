export function logError(context: string, error: unknown): void {
    if (error instanceof Error) {
        console.error(`[WARBLE] ${context}`);
        console.error(`${error.name}: ${error.message}`);

        if (error.stack) console.error(error.stack);

        return;
    }
    console.error(`[WARBLE] ${context}`, error);
}