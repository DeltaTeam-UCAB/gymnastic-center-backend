/* eslint-disable prettier/prettier */
import path from 'node:path'
import { AuditingDto } from '../../../../application/auditing/dto/dto'
import { AuditingRepository } from '../../../../application/auditing/repository/audit.repository'
import { Result } from '../../../../application/result-handler/result.handler'
import fsPromises from 'node:fs/promises'


export class AuditingTxtRepository implements AuditingRepository {
    async saveAudit(data: AuditingDto): Promise<Result<string>> {
        
        const auditText = `User: ${data.user} | Operation: ${
            data.operation
        } | Succes: ${data.succes} | Date: ${
            data.ocurredOn
        } | Data: ${
            data.data  
        }\n`
        
        console.log()
        const dirPath = path.join(process.cwd(),
            './auditingFiles')
        const filePath = path.join(dirPath, './Auditing.txt')
        
        try {

            await fsPromises.mkdir(dirPath, { recursive: true })
            
            try {
                await fsPromises.access(filePath)
            } catch (err) {
                await fsPromises.writeFile(filePath, '', { encoding: 'utf8' })
            }
            
            await fsPromises.appendFile(filePath, auditText, { encoding: 'utf8' })
            
            return Result.success('succes')
            
        } catch (err) {
            return Result.error(err)
        }       
    }
}