import { Global, Module } from '@nestjs/common';
import { SmtpAdapter } from './infrastructure/smtp.adapter';

@Global()
@Module({
  providers: [SmtpAdapter],
  exports: [SmtpAdapter],
})
export class CoreModule {}
