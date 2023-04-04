export class ResultNotification<T = null> {
  constructor(data: T | null = null) {
    this.data = data;
  }

  extensions: NotificationExtension[] = [];
  code = 0;
  data: T | null = null;

  hasError() {
    return this.code !== 0;
  }

  addError(
    message: string,
    key: string | null = null,
    code: number | null = null,
  ) {
    this.code = code ?? 1;
    this.extensions.push(new NotificationExtension(message, key));
  }

  addData(data: T) {
    this.data = data;
  }
}

export class NotificationExtension {
  constructor(public message: string, public key: string | null) {}
}
