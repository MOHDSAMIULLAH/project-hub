import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { projects, users } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { getAuthUser } from '@/lib/auth';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required'),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await db
      .select({
        id: projects.id,
        title: projects.title,
        description: projects.description,
        created_by: projects.createdBy,
        created_at: projects.createdAt,
        updated_at: projects.updatedAt,
        creator_name: users.name,
      })
      .from(projects)
      .innerJoin(users, eq(projects.createdBy, users.id))
      .where(eq(projects.createdBy, user.userId))
      .orderBy(desc(projects.createdAt));

    return NextResponse.json({ projects: result });
  } catch (error) {
    console.error('Get projects error:', error);
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
    const validatedData = projectSchema.parse(body);

    const result = await db.insert(projects).values({
      title: validatedData.title,
      description: validatedData.description,
      createdBy: user.userId,
    }).returning();

    return NextResponse.json({ project: result[0] }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
