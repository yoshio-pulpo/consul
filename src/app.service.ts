import {
  HttpService,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ValidationRequestDto } from './request/validation-request.dto';
const url = require('url');

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  async create(key: string, value: string): Promise<number> {
    const response = await this.httpService
      .put(
        url.resolve(
          process.env.CONSUL_PROTOCOL +
            '://' +
            process.env.CONSUL_HOST +
            ':' +
            process.env.CONSUL_PORT +
            '/' +
            process.env.CONSUL_VERSION +
            '/' +
            process.env.CONSUL_NAME +
            '/staging/',
          key,
        ),
        value,
      )
      .toPromise()
      .catch((error) => {
        console.log(error);
        const status = error.response.data.statusCode;
        var message = error.response.data.message;

        console.log(status);
        console.log(message);
      });
    if (response) {
      return response.status;
    }
  }

  async read(key: string): Promise<number> {
    // console.log(url.resolve(process.env.CONSUL_HOST, ':', process.env.CONSUL_PORT, process.env.CONSUL_VERSION, process.env.CONSUL_NAME, key));

    const response = await this.httpService
      .get(
        url.resolve(
          process.env.CONSUL_HOST +
            ':' +
            process.env.CONSUL_PORT +
            '/' +
            process.env.CONSUL_VERSION +
            '/' +
            process.env.CONSUL_NAME,
          key,
        ),
      )
      .toPromise()
      .catch((error) => {
        console.log(error.response.data);
        const status = error.response.data.statusCode;
        var message = error.response.data.message;
        console.log(status);
        console.log(message);
      });
    if (response) {
      console.log(response);
      return response.status;
    }
  }

  async hasFeature(validationRequestDto: ValidationRequestDto): Promise<void> {
    // console.log(url.resolve(process.env.CONSUL_HOST, ':', process.env.CONSUL_PORT, process.env.CONSUL_VERSION, process.env.CONSUL_NAME, key));
    const { feature, accountId, userId } = validationRequestDto;
    const response = await this.httpService
      .get(
        url.resolve(
          process.env.CONSUL_HOST +
            ':' +
            process.env.CONSUL_PORT +
            '/' +
            process.env.CONSUL_VERSION +
            '/' +
            process.env.CONSUL_NAME +
            '/staging/',
          feature,
        ),
      )
      .toPromise()
      .catch((error) => {
        throw new NotFoundException(error.message);
      });
    if (response) {
      const users = Buffer.from(response.data[0].Value, 'base64')
        .toString('ascii')
        .split(',')
        .map((x) => +x);
      if (!users.includes(userId)) {
        throw new NotFoundException();
      }
    }
  }
}
