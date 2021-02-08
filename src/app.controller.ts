import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { response } from 'express';
import { PlainBody } from './app.decorator';
import { AppService } from './app.service';
import { ValidationRequestDto } from './request/validation-request.dto';

@Controller('/v0/consul')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async create(@PlainBody() text: string): Promise<any> {
    try {
      const env = text.split('\n');
      var response;
      env.forEach((line) => {
        // console.log(line);
        const separator = line.indexOf('=');
        const key = line.slice(0, separator);
        const value = line.slice(separator + 1, line.length);
        response = this.appService.create(key, value);
      });
      return response;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      console.log(error);
      throw new ForbiddenException(error.message);
    }
  }

  // @Get()
  // async list(@Query() optParams): Promise<any> {
  //   try {
  //     console.log("hola");
  //   } catch (error) {
  //     if (error instanceof InternalServerErrorException) {
  //       throw error;
  //     }

  //     throw new ForbiddenException(error.message);
  //   }
  // }

  @Get(':key')
  async read(@Param('key') key: string): Promise<any> {
    try {
      return 'vlaue prueba';
      return await this.appService.read(key);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new ForbiddenException(error.message);
    }
  }

  @Get('validate')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  // async hasFeature(@Param(new ValidationPipe({ whitelist: true })) validationRequestDto: ValidationRequestDto): Promise<boolean> {
  async hasFeature(
    @Query() validationRequestDto: ValidationRequestDto,
  ): Promise<void> {
    // async validate(@Filters validationRequestDto: ValidationRequestDto): Promise<boolean> {
    try {
      return await this.appService.hasFeature(validationRequestDto);
    } catch (error) {
      console.log(error);

      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
    }
  }
}
