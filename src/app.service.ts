import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Go to Swagger UI: <a href="/documentation">http://localhost:3000/documentation</a>';
  }
}
