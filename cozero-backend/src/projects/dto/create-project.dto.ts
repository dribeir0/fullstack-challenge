import { ArrayNotEmpty } from 'class-validator';

export class CreateProjectDto {
  name: string;
  description: string;
  co2EstimateReduction: number[];
  owner: string;
  @ArrayNotEmpty()
  listing: string[];
}
