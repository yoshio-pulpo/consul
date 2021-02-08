import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import * as rawBody from "raw-body";
import { ValidationRequestDto } from './request/validation-request.dto';

export const PlainBody = createParamDecorator(async (_, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest<import("express").Request>();
  if (!req.readable) { throw new BadRequestException("Body aint text/plain"); }

  const body = (await rawBody(req)).toString("utf8").trim();
  return body;
})

// export const Filters = createParamDecorator((data, req) => {
//   const result = new ValidationRequestDto();
//   result.feature = String(req.query.feature);
//   result.accountId = Number(req.query.accountId);
//   result.userId = Number(req.query.userId);
//   return result;
// });