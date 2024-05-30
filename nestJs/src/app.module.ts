import { MongooseModule } from '@nestjs/mongoose';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { ProductMiddleware } from './modules/product/product.middleware';
import { ProductController } from './modules/product/product.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://0.0.0.0/bussola-NestJs'), 
    ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProductMiddleware)
      .forRoutes(ProductController);
  }
}
