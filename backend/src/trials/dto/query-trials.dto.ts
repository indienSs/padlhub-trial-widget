import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryTrialsDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  date?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  stationId?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  type?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  level?: string;
}
