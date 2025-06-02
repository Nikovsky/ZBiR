import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientInitializationError,
  PrismaClientRustPanicError,
} from '@prisma/client/runtime/library';

@Catch()
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();
    const path = request.url;

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof PrismaClientKnownRequestError) {
      this.logger.warn(`PrismaClientKnownRequestError: ${exception.code}`);
      switch (exception.code) {
        case 'P2002':
          statusCode = HttpStatus.CONFLICT;
          message = `Unique constraint failed on field(s): ${exception.meta?.target}`;
          break;
        case 'P2025':
          statusCode = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          break;
        case 'P2003':
          statusCode = HttpStatus.BAD_REQUEST;
          message = 'Foreign key constraint failed';
          break;
        default:
          message = `Database error: ${exception.message}`;
          break;
      }
    }

    else if (exception instanceof PrismaClientUnknownRequestError) {
      this.logger.error('PrismaClientUnknownRequestError', exception);
      message = 'Unknown database error occurred';
    }

    else if (exception instanceof PrismaClientInitializationError) {
      this.logger.error('PrismaClientInitializationError', exception);
      message = 'Failed to initialize database connection';
    }

    else if (exception instanceof PrismaClientRustPanicError) {
      this.logger.error('PrismaClientRustPanicError', exception);
      message = 'Unexpected database panic occurred';
    }

    else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const responseBody = exception.getResponse();
      message = typeof responseBody === 'string' ? responseBody : (responseBody as any).message;
    }

    else {
      this.logger.error('Unexpected error', exception);
    }

    response.status(statusCode).json({
      statusCode,
      timestamp,
      path,
      message,
    });
  }
}

