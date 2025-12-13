import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';
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
    const existing = await query(
      'SELECT created_by FROM projects WHERE id = $1',
      [id]
    );

    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (existing.rows[0].created_by !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await query(
      `UPDATE projects 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 
       RETURNING *`,
      [validatedData.title, validatedData.description, id]
    );

    return NextResponse.json({ project: result.rows[0] });
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
    const existing = await query(
      'SELECT created_by FROM projects WHERE id = $1',
      [id]
    );

    if (existing.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (existing.rows[0].created_by !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await query('DELETE FROM projects WHERE id = $1', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}