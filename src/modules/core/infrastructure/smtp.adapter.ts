import { Injectable } from '@nestjs/common';

@Injectable()
export class SmtpAdapter {
  async send(to: string, subject: string, body: string) {}
}
