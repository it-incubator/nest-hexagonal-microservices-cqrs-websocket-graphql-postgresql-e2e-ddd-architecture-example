import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityGovApiAdapter {
  async isSwindler(firstName: string, lastName: string) {
    if (lastName === 'Bender') {
      return true;
    }

    return false;
  }
}
