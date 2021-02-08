import { IsNotEmpty, IsUUID, IsNumber, IsString, isDecimal, isInt, IsInt, isString, IsOptional } from 'class-validator';

export class ValidationRequestDto {
    @IsNotEmpty()
    @IsString()
    feature: string;

    @IsOptional()
    @IsNumber()
    accountId: number;

    @IsNotEmpty()
    @IsNumber()
    userId: number;
}