import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
export class ClubDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly fechaFundacion: Date;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  readonly imagen: string;

  @IsString()
  @IsNotEmpty()
  readonly descripcion: string;
}
