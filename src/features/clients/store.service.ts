import { Injectable } from '@nestjs/common';
import { asyncLocalStorage, StoreType } from '../../config/middlewareSetup';

@Injectable()
export class StoreService {
  getStore(): StoreType {
    const store = asyncLocalStorage.getStore();
    if (!store)
      throw new Error(
        'Set up middleware to save store: StoreType to asyncLocalStorage',
      );
    return store;
  }
}
