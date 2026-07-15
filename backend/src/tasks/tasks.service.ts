import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { db } from '../db';
import { tasks } from '../db/schema';
import { eq, and, ilike, SQL } from 'drizzle-orm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class TasksService {
  constructor(private activityService: ActivityService) {}

  async create(userId: string, dto: CreateTaskDto) {
    const result = await db
      .insert(tasks)
      .values({
        userId,
        title: dto.title,
        description: dto.description,
        priority: dto.priority ?? 'MEDIUM',
        status: dto.status ?? 'PENDING',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      })
      .returning();

    // Log activity
    try {
      await this.activityService.logActivity(
        userId,
        'Task Created',
        'Task',
        result[0].id,
      );
    } catch (error) {
      console.error('Error logging activity:', error);
    }

    return result[0];
  }

  async findAll(
    userId: string,
    filters: {
      search?: string;
      status?: string;
      priority?: string;
    },
  ) {
    const conditions: SQL[] = [eq(tasks.userId, userId)];

    if (filters.status) {
      conditions.push(eq(tasks.status, filters.status as any));
    }

    if (filters.priority) {
      conditions.push(eq(tasks.priority, filters.priority as any));
    }

    if (filters.search) {
      conditions.push(ilike(tasks.title, `%${filters.search}%`));
    }

    return await db
      .select()
      .from(tasks)
      .where(and(...conditions))
      .orderBy(tasks.createdAt);
  }

  async findOne(id: string, userId: string) {
    const result = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .limit(1);

    if (!result[0]) {
      throw new NotFoundException('Task not found');
    }
    return result[0];
  }

  async update(id: string, userId: string, dto: UpdateTaskDto) {
    await this.findOne(id, userId);

    const result = await db
      .update(tasks)
      .set({
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.priority && { priority: dto.priority }),
        ...(dto.status && { status: dto.status }),
        ...(dto.dueDate !== undefined && {
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        }),
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();

    // Log activity
    try {
      await this.activityService.logActivity(
        userId,
        'Task Updated',
        'Task',
        id,
      );
    } catch (error) {
      console.error('Error logging activity:', error);
    }

    return result[0];
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));

    // Log activity
    try {
      await this.activityService.logActivity(
        userId,
        'Task Deleted',
        'Task',
        id,
      );
    } catch (error) {
      console.error('Error logging activity:', error);
    }

    return { message: 'Task deleted successfully' };
  }

  async markComplete(id: string, userId: string) {
    await this.findOne(id, userId);

    const result = await db
      .update(tasks)
      .set({
        status: 'COMPLETED',
        completedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
      .returning();

    // Log activity
    try {
      await this.activityService.logActivity(
        userId,
        'Task Completed',
        'Task',
        id,
      );
    } catch (error) {
      console.error('Error logging activity:', error);
    }

    return result[0];
  }

  async findOverdue(userId?: string) {
    const now = new Date();
    const conditions: SQL[] = [
      eq(tasks.status, 'PENDING'),
    ];

    if (userId) {
      conditions.push(eq(tasks.userId, userId));
    }

    const result = await db
      .select()
      .from(tasks)
      .where(and(...conditions));

    return result.filter(
      (task) => task.dueDate && new Date(task.dueDate) < now,
    );
  }
}