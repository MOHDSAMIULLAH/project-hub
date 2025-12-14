import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { projects } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';

const projectSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
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
    const validatedData = projectSchema.parse(body);

    // Check ownership
    const existing = await db.select().from(projects).where(eq(projects.id, id));

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (existing[0].createdBy !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updateData: any = { updatedAt: new Date() };
    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;

    const result = await db.update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning();

    return NextResponse.json({ project: result[0] });
  } catch (error) {
    console.error('Update project error:', error);
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

    // Check ownership
    const existing = await db.select().from(projects).where(eq(projects.id, id));

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (existing[0].createdBy !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.delete(projects).where(eq(projects.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}