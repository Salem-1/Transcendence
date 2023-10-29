import { Body, ConsoleLogger, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/authenticated')
  authenticatedCallBack(@Body() body: any): string {
    console.log('Received body:', body);
    return 'Received and processed the body content';
  }

  @Post('/authenticated/:id')
  getauthenticatedCallBack(@Param ('id') id: string): string {
    console.log('Received URL parameter:', id);
    return 'Received and processed the URL parameter';
  }
}
