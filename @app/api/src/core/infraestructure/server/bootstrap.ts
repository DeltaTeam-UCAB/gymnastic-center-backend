import { AppModule } from '../application-module/app.module'
import { PORT } from './port/port'
import { ServerBuilder } from './builder/server.builder'
import { runServer } from './run/run.server'

export default async function bootstrap() {
    const builder = await ServerBuilder.create(AppModule)
    const app = builder
        .setCors()
        .setGlobalProfix('api')
        .setValidationPipe()
        .setDocumentation({
            title: 'API Docs',
            description: 'API Documentation',
            version: '1.0',
            path: 'api/docs',
        })
        .build()
    await runServer(app, PORT)
}
