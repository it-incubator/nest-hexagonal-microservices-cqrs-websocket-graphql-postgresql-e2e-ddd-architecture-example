import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityGovApiAdapter {
  async isSwindler(firstName: string, lastName: string) {
    return false;
  }

  constructor() {
    console.log('SecurityGovApiAdapter: constructor');
  }
}
