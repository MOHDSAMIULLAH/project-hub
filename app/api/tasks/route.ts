import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';
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

    let queryText = `
      SELECT t.*, u.name as creator_name 
      FROM tasks t 
      JOIN users u ON t.created_by = u.id 
      WHERE t.created_by = $1
    `;
    const params: any[] = [user.userId];

    if (projectId) {
      queryText += ' AND t.project_id = $2';
      params.push(projectId);
    }

    queryText += ' ORDER BY t.created_at DESC';

    const result = await query(queryText, params);

    return NextResponse.json({ tasks: result.rows });
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
    const projectCheck = await query(
      'SELECT id FROM projects WHERE id = $1 AND created_by = $2',
      [validatedData.project_id, user.userId]
    );

    if (projectCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found or unauthorized' },
        { status: 403 }
      );
    }

    const result = await query(
      `INSERT INTO tasks (title, description, status, priority, estimated_hours, project_id, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        validatedData.title,
        validatedData.description || null,
        validatedData.status,
        validatedData.priority,
        validatedData.estimated_hours || null,
        validatedData.project_id,
        user.userId,
      ]
    );

    return NextResponse.json({ task: result.rows[0] }, { status: 201 });
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