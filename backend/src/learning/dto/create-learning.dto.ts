import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateLearningDto {
  @IsString()
  @MinLength(1)
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}