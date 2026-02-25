import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Genildo Burgos' })
  nome: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'minhaSenha123', minLength: 6 })
  senha: string;

  @ApiProperty({ example: 'token-admin', required: false })
  adminToken?: string;
}
