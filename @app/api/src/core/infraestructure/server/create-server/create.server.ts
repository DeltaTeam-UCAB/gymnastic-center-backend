import { NestFactory } from '@nestjs/core'
import { TypeClass } from '@mono/types-utils'

export const createServer = async <T, U extends TypeClass<T>>(module: U) =>
    NestFactory.create(module)
