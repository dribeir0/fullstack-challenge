import { ArrayNotEmpty, IsArray, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsOptional()
  @IsArray()
  co2EstimateReduction: number[];
  @IsString()
  owner: string;
  @ArrayNotEmpty()
  listing: string[];
}
