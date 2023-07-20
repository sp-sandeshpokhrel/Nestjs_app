//import twilio from 'twilio';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message';
import TwilioClient from 'twilio/lib/rest/Twilio';
import { TwilioServiceOptions } from './twilio-service-options';

@Injectable()
export class TwilioService {
  client: TwilioClient;
  from: string;

  constructor(options: TwilioServiceOptions) {
    const twilioAccountSid = options.accountSid;
    const twilioAuthToken = options.authToken;
    this.from = options.from;

    if (!twilioAccountSid || !twilioAuthToken) {
      throw new Error('Twilio account SID/auth token not found');
    }

    this.client = require('twilio')(twilioAccountSid, twilioAuthToken);
  }

  async sendSms(options: MessageListInstanceCreateOptions) {
    return this.client.messages.create({
      ...options,
      from: `whatsapp:${this.from ? this.from : options.from}`,
      to: `whatsapp:${options.to}`,
    });
  }

  async bulkSendSms(options: MessageListInstanceCreateOptions[]) {
    const promises = options.map((option) => this.sendSms(option));
    return Promise.all(promises);
  }
}
