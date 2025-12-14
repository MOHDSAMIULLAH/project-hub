import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { tasks, users, projects } from '@/lib/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'completed']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  estimated_hours: z.number().positive().nullable().optional(),
  project_id: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');

    let query = db
      .select({
        id: tasks.id,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        priority: tasks.priority,
        estimated_hours: tasks.estimatedHours,
        project_id: tasks.projectId,
        created_by: tasks.createdBy,
        created_at: tasks.createdAt,
        updated_at: tasks.updatedAt,
        creator_name: users.name,
      })
      .from(tasks)
      .innerJoin(users, eq(tasks.createdBy, users.id));

    if (projectId) {
      query = query.where(and(eq(tasks.createdBy, user.userId), eq(tasks.projectId, projectId)));
    } else {
      query = query.where(eq(tasks.createdBy, user.userId));
    }

    const result = await query.orderBy(desc(tasks.createdAt));

    return NextResponse.json({ tasks: result });
  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = taskSchema.parse(body);

    // Verify project ownership
    const projectCheck = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, validatedData.project_id), eq(projects.createdBy, user.userId)));

    if (projectCheck.length === 0) {
      return NextResponse.json(
        { error: 'Project not found or unauthorized' },
        { status: 403 }
      );
    }

    const result = await db.insert(tasks).values({
      title: validatedData.title,
      description: validatedData.description,
      status: validatedData.status,
      priority: validatedData.priority,
      estimatedHours: validatedData.estimated_hours?.toString(),
      projectId: validatedData.project_id,
      createdBy: user.userId,
    }).returning();

    return NextResponse.json({ task: result[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}