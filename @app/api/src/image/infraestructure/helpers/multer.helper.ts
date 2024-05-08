import { diskStorage } from 'multer'
import { join } from 'node:path'
import { Express } from 'express'

const imageFilter = (
    _: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
) => {
    if (!Boolean(file.mimetype.match(/(png|jpg|jpge)/))) callback(null, false)
    callback(null, true)
}
export const configImageMulter = {
    fileFilter: imageFilter,
    storage: diskStorage({
        destination: join(process.cwd(), './public/uploads/image'),
        filename: (_, file, callback) =>
            callback(
                null,
                Date.now() + '.' + file.originalname.split('.').at(-1),
            ),
    }),
}
