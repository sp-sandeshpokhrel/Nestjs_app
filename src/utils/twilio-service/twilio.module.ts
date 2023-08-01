import { DynamicModule, Module } from "@nestjs/common";
import { TwilioServiceOptions } from "./twilio-service-options";
import { TwilioService } from "./twilio.service";

@Module({})
export class TwilioModule {
  static forRoot(options: TwilioServiceOptions): DynamicModule {
    const providers = [
      {
        provide: TwilioService,
        useValue: new TwilioService(options),
      },
    ];

    return {
      providers: providers,
      exports: providers,
      module: TwilioModule,
    };
  }
}
