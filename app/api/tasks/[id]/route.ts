import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';
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
    const existing = await query(
      'SELECT created_by FROM tasks WHERE id = $1',
      [id]
    );

    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (existing.rows[0].created_by !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.entries(validatedData).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    values.push(id);

    const result = await query(
      `UPDATE tasks 
       SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    return NextResponse.json({ task: result.rows[0] });
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

    const existing = await query(
      'SELECT created_by FROM tasks WHERE id = $1',
      [id]
    );

    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (existing.rows[0].created_by !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await query('DELETE FROM tasks WHERE id = $1', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
