import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { tasks } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';

const taskUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  estimated_hours: z.number().positive().nullable().optional(),
});

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    const { id } = await context.params;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = taskUpdateSchema.parse(body);

    // Check ownership
    const existing = await db.select().from(tasks).where(eq(tasks.id, id));

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (existing[0].createdBy !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData: any = { updatedAt: new Date() };
    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.status !== undefined) updateData.status = validatedData.status;
    if (validatedData.priority !== undefined) updateData.priority = validatedData.priority;
    if (validatedData.estimated_hours !== undefined) {
      updateData.estimatedHours = validatedData.estimated_hours?.toString();
    }

    const result = await db.update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();

    return NextResponse.json({ task: result[0] });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    const { id } = await context.params;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await db.select().from(tasks).where(eq(tasks.id, id));

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (existing[0].createdBy !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.delete(tasks).where(eq(tasks.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
