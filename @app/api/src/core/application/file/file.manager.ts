import { DeleteFileOptions } from './types/delete.options'
import { Result } from '../result-handler/result.handler'

export interface FileManager {
    delete(options: DeleteFileOptions): Promise<Result<boolean>>
}
