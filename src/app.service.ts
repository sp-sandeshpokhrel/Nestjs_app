import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Go to Swagger UI: <a href="/api">http://localhost:3000/api</a>';
  }
}
