import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { LoggerService } from '../../modules/logger/services/logger.service';
import { errorMessages } from '../constants/error-messages.constant';
import { statusCodes } from '../constants/status-codes.constant';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    let status: number;
    let messages: string[] | string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      messages = (exception as HttpException).message;
    } else {
      status = statusCodes.INTERNAL_SERVER_ERROR;
      messages = errorMessages.INTERNAL_SERVER_ERROR;
    }

    this.loggerService.error(exception);

    messages = Array.isArray(messages) ? messages : [messages];

    res.status(status).json({
      messages,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
