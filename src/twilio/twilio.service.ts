//import twilio from 'twilio';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message';
import TwilioClient from 'twilio/lib/rest/Twilio';

@Injectable()
export class TwilioService {
  client: TwilioClient;

  private readonly logger = new Logger(TwilioService.name);

  constructor(private configService: ConfigService) {
    const twilioAccountSid = this.configService.get<string>('TWILIO_SID');
    const twilioAuthToken = this.configService.get<string>('TWILIO_SECRET');

    if (!twilioAccountSid || !twilioAuthToken) {
      throw new Error('Twilio account SID/auth token not found');
    }

    this.client = require('twilio')(twilioAccountSid, twilioAuthToken);
  }

  async sendSms(options: MessageListInstanceCreateOptions) {
    return this.client.messages.create(options);
  }
}
