import { DomainResultNotification, ResultNotification } from './notification';
import { validateOrReject } from 'class-validator';
import {
  validationErrorsMapper,
  ValidationPipeErrorType,
} from '../../../config/pipesSetup';

export class DomainError extends Error {
  constructor(message: string, public resultNotification: ResultNotification) {
    super(message);
  }
}

export const validateEntityOrThrow = async (entity: any) => {
  try {
    await validateOrReject(entity);
  } catch (errors) {
    const resultNotification: ResultNotification = mapErorsToNotification(
      validationErrorsMapper.mapValidationErrorArrayToValidationPipeErrorTypeArray(
        errors,
      ),
    );

    throw new DomainError('domain entity validation error', resultNotification);
  }
};

export const validateEntity = async <T extends object>(
  entity: T,
  events: any,
): Promise<DomainResultNotification<T>> => {
  try {
    await validateOrReject(entity);
  } catch (errors) {
    const resultNotification: DomainResultNotification<T> =
      mapErorsToNotification<T>(
        validationErrorsMapper.mapValidationErrorArrayToValidationPipeErrorTypeArray(
          errors,
        ),
      );
    resultNotification.addData(entity);
    resultNotification.addEvents(events); // todo: should add events when error?
    return resultNotification;
  }
  const domainResultNotification = new DomainResultNotification<T>(entity);
  domainResultNotification.addEvents(events);

  return domainResultNotification;
};

export function mapErorsToNotification<T>(errors: ValidationPipeErrorType[]) {
  const resultNotification = new DomainResultNotification<T>();
  errors.forEach((item: ValidationPipeErrorType) =>
    resultNotification.addError(item.message, item.field, 1),
  );
  return resultNotification;
}
