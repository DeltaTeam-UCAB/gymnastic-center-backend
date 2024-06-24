import { AuditingDto } from '../dto/dto'
import { Result } from '../../result-handler/result.handler'

export interface IAuditingRepository {
    saveAudit(data: AuditingDto): Promise<Result<string>>
}
