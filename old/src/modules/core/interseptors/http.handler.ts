import { ResultNotification } from '../validation/notification';
import { ExceptionCodes } from '../../../config/exception-codes';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * remove from notification events and other fields except extensions, code, data
 */
class ViewNotification<T = null> extends ResultNotification {
  constructor(notification: ResultNotification<T | null>) {
    super();
    this.extensions = notification.extensions;
    this.code = notification.code;
    (this.data as T | null) = notification.data;
  }
}

export const httpHandler = <T>(result: ResultNotification<T>) => {
  if (result.hasError()) {
    const ExceptionClass = getHttpExceptions(result.code);
    throw new ExceptionClass(new ViewNotification(result));
  }

  return result;
};

const getHttpExceptions = (code: ExceptionCodes) => {
  switch (code) {
    case ExceptionCodes.Forbidden:
      return ForbiddenException;
    case ExceptionCodes.NotFound:
      return NotFoundException;
    case ExceptionCodes.Unauthorized:
      return UnauthorizedException;
    case ExceptionCodes.InternalServerError:
      return InternalServerErrorException;
    default:
      return BadRequestException;
  }
};
