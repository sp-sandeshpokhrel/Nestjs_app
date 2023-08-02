import { Catch, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception.getStatus) {
      status = exception.getStatus();
    }
    this.logger.error(exception.message, exception.stack);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const configService = new ConfigService();
    response.status(status).json({
      data: null,
      cached: false,
      statusCode: status,
      error: exception.name,
      message: exception.message,
      errorStack:
        configService.get('DEBUG') === 'development' ? exception.stack : null,
    });
  }
}
