export interface Crypto {
    encrypt(value: string): Promise<string>
    compare(normal: string, encrypted: string): Promise<boolean>
}
