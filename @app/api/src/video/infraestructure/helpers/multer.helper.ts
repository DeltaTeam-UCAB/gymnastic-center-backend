import { diskStorage } from 'multer'
import { join } from 'node:path'
import { Express } from 'express'

const videoFilter = (
    _: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
) => {
    if (!Boolean(file.mimetype.match(/(mp4)/))) callback(null, false)
    callback(null, true)
}
export const configVideoMulter = {
    fileFilter: videoFilter,
    storage: diskStorage({
        destination: join(process.cwd(), './public/uploads/video'),
        filename: (_, file, callback) =>
            callback(
                null,
                Date.now() + '.' + file.originalname.split('.').at(-1),
            ),
    }),
}
