import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityGovApiAdapter {
  async isSwindler(firstName: string, lastName: string) {
    console.log('make real request');
    return false;
  }

  constructor() {
    console.log('SecurityGovApiAdapter: constructor');
  }
}
