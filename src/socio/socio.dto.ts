import { IsNotEmpty, IsString } from 'class-validator';
export class SocioDto {
  @IsString()
  @IsNotEmpty()
  readonly usuario: string;

  @IsString()
  @IsNotEmpty()
  readonly correo: string;

  @IsNotEmpty()
  readonly fechaNacimiento: Date;
}
