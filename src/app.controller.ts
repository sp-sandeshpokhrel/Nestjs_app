import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
//import { TwilioService } from './twilio/twilio.service';
import { TwilioService } from './utils/twilio-service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly twilioservice: TwilioService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    console.log('Hello World');
    console.log(
      await this.twilioservice.sendSms({
        body: 'Hello, World!',
        to: '+9779847536829',
        //from: '+14155238886',
      }),
    );
    return this.appService.getHello();
  }
}
