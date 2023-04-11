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

export class DomainResultNotification<
  TData = null,
> extends ResultNotification<TData> {
  public events: IEvent[] = [];
  addEvents(...events: IEvent[]) {
    this.events = [...this.events, ...events];
  }

  static create<T>(
    mainNotification: DomainResultNotification<T>,
    ...otherNotifications: DomainResultNotification[]
  ) {
    const domainResultNotification = new DomainResultNotification<T>();

    domainResultNotification.addData(mainNotification.data);
    domainResultNotification.events = mainNotification.events;

    mainNotification.extensions.forEach((e) => {
      domainResultNotification.addError(e.message, e.key);
    });

    otherNotifications.forEach((n) => {
      domainResultNotification.events = [
        ...domainResultNotification.events,
        ...n.events,
      ];
      n.extensions.forEach((e) => {
        domainResultNotification.addError(e.message, e.key);
      });
    });

    return domainResultNotification;
  }
}
