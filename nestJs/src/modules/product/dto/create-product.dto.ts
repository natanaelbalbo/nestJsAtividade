import { IsNumber, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  value: number;

  @IsNumber()
  qtd: number;
}
