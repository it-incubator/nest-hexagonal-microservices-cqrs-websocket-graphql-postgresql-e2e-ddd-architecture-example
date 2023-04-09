import { Injectable } from '@nestjs/common';
import { asyncLocalStorage, StoreType } from '../../config/middlewareSetup';

@Injectable()
export class StoreService {
  getStore(): StoreType {
    return asyncLocalStorage.getStore();
  }
}
