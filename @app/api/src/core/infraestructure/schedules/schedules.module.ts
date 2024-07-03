import { globSync } from 'glob'
import { join } from 'node:path'
import { objectValues } from '@mono/object-utils'
import { BarrelModule } from '../decorators/barrel.module'
import { ScheduleModule } from '@nestjs/schedule'

const initializeModules = () => {
    const data = globSync(
        join(
            __dirname,
            '../../../**/infraestructure/modules/schedules/module.js',
        ).replace(/\\/g, '/'),
    )
    return data.asyncMap(async (e) => {
        const module = await import('file:///' + e)
        return objectValues(module)[0]
    })
}

@BarrelModule([ScheduleModule.forRoot(), ...(await initializeModules())])
export class SchedulesModule {}
