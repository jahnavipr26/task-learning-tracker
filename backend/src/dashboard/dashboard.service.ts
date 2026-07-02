import { Injectable } from '@nestjs/common';
import { db } from '../db';
import { tasks, learningTopics } from '../db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

@Injectable()
export class DashboardService {
  async getStats(userId: string) {
    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId));

    const userLearning = await db
      .select()
      .from(learningTopics)
      .where(eq(learningTopics.userId, userId));

    const now = new Date();
    const overdueTasks = userTasks.filter(
      (task) =>
        task.status !== 'COMPLETED' &&
        task.dueDate &&
        new Date(task.dueDate) < now,
    );

    const totalTasks = userTasks.length;
    const completedTasks = userTasks.filter(
      (t) => t.status === 'COMPLETED',
    ).length;
    const pendingTasks = userTasks.filter(
      (t) => t.status === 'PENDING',
    ).length;
    const inProgressTasks = userTasks.filter(
      (t) => t.status === 'IN_PROGRESS',
    ).length;
    const completedLearning = userLearning.filter(
      (l) => l.completed,
    ).length;

    // Chart data: tasks completed per day (last 7 days)
    const tasksChartData = this.getTasksChartData(userTasks);

    // Chart data: learning progress
    const learningChartData = userLearning.map((l) => ({
      title: l.title,
      progress: l.progress,
    }));

    return {
      summary: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        overdueTasks: overdueTasks.length,
        completedLearning,
        totalLearning: userLearning.length,
      },
      charts: {
        tasksByDay: tasksChartData,
        learningProgress: learningChartData,
        tasksByPriority: this.getTasksByPriority(userTasks),
        tasksByStatus: this.getTasksByStatus(userTasks),
      },
    };
  }

  private getTasksChartData(userTasks: any[]) {
    const last7Days: Record<string, number> = {};
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last7Days[dateStr] = 0;
    }

    userTasks.forEach((task) => {
      if (task.completedAt) {
        const dateStr = new Date(task.completedAt)
          .toISOString()
          .split('T')[0];
        if (last7Days[dateStr] !== undefined) {
          last7Days[dateStr]++;
        }
      }
    });

    return Object.entries(last7Days).map(([date, count]) => ({
      date,
      completed: count,
    }));
  }

  private getTasksByPriority(userTasks: any[]) {
    const priorities = { LOW: 0, MEDIUM: 0, HIGH: 0 };
    userTasks.forEach((task) => {
      priorities[task.priority]++;
    });
    return [
      { name: 'Low', value: priorities.LOW },
      { name: 'Medium', value: priorities.MEDIUM },
      { name: 'High', value: priorities.HIGH },
    ];
  }

  private getTasksByStatus(userTasks: any[]) {
    const statuses = { PENDING: 0, IN_PROGRESS: 0, COMPLETED: 0 };
    userTasks.forEach((task) => {
      statuses[task.status]++;
    });
    return [
      { name: 'Pending', value: statuses.PENDING },
      { name: 'In Progress', value: statuses.IN_PROGRESS },
      { name: 'Completed', value: statuses.COMPLETED },
    ];
  }
}