import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AppError } from 'src/shared/utils/appError.exception';

@Injectable()
export class ProductMiddleware implements NestMiddleware {
  async use(req: any, res: any, next: () => void) {
    let dto: CreateProductDto | UpdateProductDto;
    
    if (req.method === 'POST') {
      dto = plainToClass(CreateProductDto, req.body);
    } else if (req.method === 'PUT' || req.method === 'PATCH') {
      dto = plainToClass(UpdateProductDto, req.body);
    }

    if (dto) {
      const errors = await validate(dto);

      if (errors.length > 0) {
        throw new AppError({
          id: 'ERROR_VALIDATION',
          message: 'Validation error',
          status: HttpStatus.BAD_REQUEST,
          error: errors,
        });
      }

      if (req.body.value) {
        req.body.value = req.body.value * 1.25;
      }
    }

    next();
  }
}
