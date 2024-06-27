type TokenStorage = Record<string, string[]>

const storageRecord = {} satisfies TokenStorage

export const addToken = (userId: string, token: string) => {
    if (!storageRecord[userId]) storageRecord[userId] = []
    if (!storageRecord[userId].some((e) => e === token))
        storageRecord[userId].push(token)
}

export const getTokens = (userId: string): string[] =>
    storageRecord[userId] ?? []
