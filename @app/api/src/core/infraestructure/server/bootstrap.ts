import { AppModule } from '../application-module/app.module'
import { PORT } from './port/port'
import { ServerBuilder } from './builder/server.builder'
import { runServer } from './run/run.server'

export default async function bootstrap() {
    const builder = await ServerBuilder.create(AppModule)
    const app = builder.setCors().setGlobalProfix('api').setValidationPipe()
    if (process.env.NODE_ENV === 'development')
        app.setDocumentation({
            title: 'Gymnastic center API Docs',
            description: 'API Documentation for Gymnastic center',
            version: '1.0',
            path: 'api/docs',
            bearerAuth: true,
        })
    await runServer(app.build(), PORT)
}
