import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as morgan from 'morgan'
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000
  app.enableCors()
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.use(morgan('dev'))
  const config = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API description')
    .setVersion('0.1')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))
  await app.listen(port)
  console.log(`Server is running on ${port}`)
}
bootstrap()
