import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AppError } from 'src/shared/utils/appError.exception';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      return await this.productService.create(createProductDto);
    } catch (error) {
      throw new AppError({
        id: 'ERROR_CREATE_PRODUCT',
        message: 'Error to create a product',
        status: HttpStatus.BAD_REQUEST,
        error,
      })
    }
  }

  @Get()
  async findAll() {
    const products = await this.productService.findAll();

    if (!products.length) {
      throw new AppError({
        id: 'ERROR_NO_PRODUCTS',
        message: 'No products found',
        status: HttpStatus.NOT_FOUND,
      })
    }

    return products;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);

    if (!product) {
      throw new AppError({
        id: 'ERROR_PRODUCT_NOT_FOUND',
        message: 'Product not found',
        status: HttpStatus.NOT_FOUND,
      })
    }

    return product;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      await this.findOne(id);

      return await this.productService.update(id, updateProductDto);
    } catch (error) {
      throw new AppError({
        id: 'ERROR_UPDATE_PRODUCT',
        message: 'Error to update a product',
        status: HttpStatus.BAD_REQUEST,
        error,
      })
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.productService.remove(id);
    } catch (error) {
      throw new AppError({
        id: 'ERROR_REMOVE_PRODUCT',
        message: 'Error to remove a product',
        status: HttpStatus.BAD_REQUEST,
        error,
      })
    }
  }
}
