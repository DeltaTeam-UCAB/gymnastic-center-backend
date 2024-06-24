import { Result } from '../result-handler/result.handler'
import { ApplicationService } from '../service/application.service'
import { IAuditingRepository } from '../auditing/repository/audit.repository'
import { isNotNull } from '../../../utils/null-manager/null-checker'
import { AuditingDto } from '../auditing/dto/dto'

export class AuditDecorator<T, R> implements ApplicationService<T, R> {
    constructor(
        private service: ApplicationService<T, R>,
        private auditter: IAuditingRepository,
        private dto: AuditingDto,
    ) {}
    async execute(data: T): Promise<Result<R>> {
        try {
            const result = await this.service.execute(data)
            this.dto.ocurredOn = new Date(Date.now())
            if (result.isError()) {
                this.dto.succes = false
                this.auditter.saveAudit(this.dto)
            }
            if (!result.isError() && isNotNull(result.unwrap())) {
                this.dto.succes = true
                this.dto.data = result.unwrap()
                this.auditter.saveAudit(this.dto)
            }
            return result
        } catch (error) {
            throw error
        }
    }
}
