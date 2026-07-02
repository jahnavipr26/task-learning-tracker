import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LearningService } from './learning.service';
import { CreateLearningDto } from './dto/create-learning.dto';
import { UpdateLearningDto } from './dto/update-learning.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('learning')
export class LearningController {
  constructor(private learningService: LearningService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateLearningDto) {
    return this.learningService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req, @Query('search') search?: string) {
    return this.learningService.findAll(req.user.id, search);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.learningService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() dto: UpdateLearningDto,
  ) {
    return this.learningService.update(id, req.user.id, dto);
  }

  @Patch(':id/progress')
  updateProgress(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { progress: number },
  ) {
    return this.learningService.updateProgress(id, req.user.id, body.progress);
  }

  @Patch(':id/complete')
  markComplete(@Request() req, @Param('id') id: string) {
    return this.learningService.markComplete(id, req.user.id);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.learningService.remove(id, req.user.id);
  }
}