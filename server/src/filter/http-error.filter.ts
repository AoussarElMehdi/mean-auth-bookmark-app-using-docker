import { ArgumentsHost, Catch, ExceptionFilter, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
        const message = exception instanceof HttpException ? this.getMessageException(exception) : 'Internal server error'
        
        response
            .status(statusCode)
            .json({ 
                statusCode: statusCode,
                message: message
            })
    }

    private getMessageException = (exception: any): string => {
        if(exception.hasOwnProperty('response')){
            const message = exception.response.message;
            if(Array.isArray(message)){
                return message.join(', ');
            }
            return message;
        }
        return exception.message
    }


}