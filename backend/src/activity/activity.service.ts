import { Injectable } from '@nestjs/common';
import { db } from '../db';
import { activityLogs } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ActivityService {
  async getActivities(userId: string) {
    try {
      const activities = await db
        .select()
        .from(activityLogs)
        .where(eq(activityLogs.userId, userId))
        .orderBy((table) => table.createdAt);

      return activities;
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }

  async logActivity(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
  ) {
    try {
      await db.insert(activityLogs).values({
        userId,
        action,
        entityType,
        entityId,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }
}