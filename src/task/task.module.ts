import { Module } from '@nestjs/common';
import { TaskService } from './task.service';

@Module({
  providers: [TaskService],
  controllers: [],
  exports: [TaskService],
})
export class TaskModule {}
