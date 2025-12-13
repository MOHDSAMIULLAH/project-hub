import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';
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

    const result = await query(
      `SELECT p.*, u.name as creator_name 
       FROM projects p 
       JOIN users u ON p.created_by = u.id 
       WHERE p.created_by = $1 
       ORDER BY p.created_at DESC`,
      [user.userId]
    );

    return NextResponse.json({ projects: result.rows });
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

    const result = await query(
      `INSERT INTO projects (title, description, created_by) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [validatedData.title, validatedData.description, user.userId]
    );

    return NextResponse.json({ project: result.rows[0] }, { status: 201 });
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
