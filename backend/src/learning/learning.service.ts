import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../db';
import { learningTopics } from '../db/schema';
import { eq, and, ilike, SQL } from 'drizzle-orm';
import { CreateLearningDto } from './dto/create-learning.dto';
import { UpdateLearningDto } from './dto/update-learning.dto';

@Injectable()
export class LearningService {
  async create(userId: string, dto: CreateLearningDto) {
    const result = await db
      .insert(learningTopics)
      .values({
        userId,
        title: dto.title,
        description: dto.description,
        notes: dto.notes,
        progress: 0,
        completed: false,
      })
      .returning();
    return result[0];
  }

  async findAll(userId: string, search?: string) {
    const conditions: SQL[] = [eq(learningTopics.userId, userId)];

    if (search) {
      conditions.push(ilike(learningTopics.title, `%${search}%`));
    }

    return await db
      .select()
      .from(learningTopics)
      .where(and(...conditions))
      .orderBy(learningTopics.createdAt);
  }

  async findOne(id: string, userId: string) {
    const result = await db
      .select()
      .from(learningTopics)
      .where(and(eq(learningTopics.id, id), eq(learningTopics.userId, userId)))
      .limit(1);

    if (!result[0]) {
      throw new NotFoundException('Learning topic not found');
    }
    return result[0];
  }

  async update(id: string, userId: string, dto: UpdateLearningDto) {
    await this.findOne(id, userId);

    const result = await db
      .update(learningTopics)
      .set({
        ...(dto.title && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
        ...(dto.progress !== undefined && { progress: dto.progress }),
        ...(dto.completed !== undefined && { completed: dto.completed }),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(learningTopics.id, id),
          eq(learningTopics.userId, userId),
        ),
      )
      .returning();

    return result[0];
  }

  async updateProgress(id: string, userId: string, progress: number) {
    await this.findOne(id, userId);

    const result = await db
      .update(learningTopics)
      .set({
        progress: Math.min(100, Math.max(0, progress)),
        ...(progress === 100 && { completed: true }),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(learningTopics.id, id),
          eq(learningTopics.userId, userId),
        ),
      )
      .returning();

    return result[0];
  }

  async markComplete(id: string, userId: string) {
    await this.findOne(id, userId);

    const result = await db
      .update(learningTopics)
      .set({
        completed: true,
        progress: 100,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(learningTopics.id, id),
          eq(learningTopics.userId, userId),
        ),
      )
      .returning();

    return result[0];
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    await db
      .delete(learningTopics)
      .where(
        and(
          eq(learningTopics.id, id),
          eq(learningTopics.userId, userId),
        ),
      );

    return { message: 'Learning topic deleted successfully' };
  }
}