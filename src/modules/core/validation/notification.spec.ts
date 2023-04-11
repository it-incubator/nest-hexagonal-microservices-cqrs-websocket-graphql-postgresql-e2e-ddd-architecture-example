import { ResultNotification, NotificationExtension } from './notification';

describe('ResultNotification', () => {
  let resultNotification: ResultNotification;

  beforeEach(() => {
    resultNotification = new ResultNotification();
  });

  test('hasError should return false when code is 0', () => {
    expect(resultNotification.hasError()).toBe(false);
  });

  test('hasError should return true when code is not 0', () => {
    resultNotification.code = 1;
    expect(resultNotification.hasError()).toBe(true);
  });

  test('addError should add a NotificationExtension with given message and key', () => {
    const message = 'Error message';
    const key = 'error_key';
    resultNotification.addError(message, key);

    expect(resultNotification.extensions.length).toBe(1);
    expect(resultNotification.extensions[0].message).toBe(message);
    expect(resultNotification.extensions[0].key).toBe(key);
    expect(resultNotification.extensions[0].key).toBe(key);
  });

  test('addError should set the code to given code if provided', () => {
    const code = 404;
    resultNotification.addError('Error message', 'error_key', code);

    expect(resultNotification.code).toBe(code);
  });

  test('addError should set the code to 1 if no code is provided', () => {
    resultNotification.addError('Error message', 'error_key');

    expect(resultNotification.code).toBe(1);
  });
});

describe('NotificationExtension', () => {
  test('constructor should set message and key properties', () => {
    const message = 'Error message';
    const key = 'error_key';
    const notificationExtension = new NotificationExtension(message, key);

    expect(notificationExtension.message).toBe(message);
    expect(notificationExtension.key).toBe(key);
  });
});
