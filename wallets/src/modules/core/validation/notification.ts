import { IEvent } from '@nestjs/cqrs';

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

  static createError(message: string,
                       key: string | null = null,
                       code: number | null = null,) {
    const notification = new ResultNotification();
    notification.addError(message, key, code);
    return notification;
  }

  addSuccess(
      message: string,
      key: string | null = null,
  ) {
    this.extensions.push(new NotificationExtension(message, key, 0));
  }


  addError(
    message: string,
    key: string | null = null,
    code: number | null = null,
  ) {
    if (this.code === 0) {
      this.code = code ?? 1;
    }

    let codeForExtension = 1; // if someone pass code = 0, then code should be 1
    // for case 0, null, undefined
    if (code) {
      codeForExtension = code;
    }

    this.extensions.push(new NotificationExtension(message, key, codeForExtension));
  }

  addExtension(
      message: string,
      key: string | null = null,
      code: number,
  ) {
    this.extensions.push(new NotificationExtension(message, key, code));
  }


  setCode(code) {
    this.code = code;
  }

  addData(data: T) {
    this.data = data;
  }
}

export class NotificationExtension {
  constructor(public message: string, public key: string | null, public code: number = 1) {}
}

type Nullable<T> = T | null;

export class DomainResultNotification<
  TData  = null,
> extends ResultNotification<TData | null> {
  public events: IEvent[] = [];
  addEvents(...events: IEvent[]) {
    this.events = [...this.events, ...events];
  }

  static createError(  message: string,
                       key: string | null = null,
                       code: number | null = null,) {
    const notification = new DomainResultNotification();
    notification.addError(message, key, code);
    return notification;
  }


  static merge<T>(
    mainNotification: DomainResultNotification<T>,
    ...otherNotifications: DomainResultNotification[]
  ) {
    const domainResultNotification = new DomainResultNotification<T>();

    // get code from main notification
    domainResultNotification.setCode(mainNotification.code);

    // get data only from main notification
    if (!!mainNotification.data) {
      domainResultNotification.addData(mainNotification.data);
    }
    domainResultNotification.events = mainNotification.events;

    // copy extensions
    mainNotification.extensions.forEach((e) => {
      domainResultNotification.addExtension(e.message, e.key, e.code);
    });

    // copy events from all other notifications
    otherNotifications.forEach((n) => {
      domainResultNotification.events = [
        ...domainResultNotification.events,
        ...n.events,
      ];
      n.extensions.forEach((e) => {
        domainResultNotification.addExtension(e.message, e.key, e.code);
      });
    });

    return domainResultNotification;
  }
}
