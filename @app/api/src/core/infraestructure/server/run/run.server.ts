import { INestApplication } from '@nestjs/common'

export const runServer = async (
    app: INestApplication,
    port: number | string,
) => {
    await app.listen(port)
}
