import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthUser } from '@/lib/auth';
import { analyzeProject } from '@/lib/gemini';
import { query } from '@/lib/db';

const analyzeSchema = z.object({
  project_id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { project_id } = analyzeSchema.parse(body);

    // Get project details
    const projectResult = await query(
      'SELECT title FROM projects WHERE id = $1 AND created_by = $2',
      [project_id, user.userId]
    );

    if (projectResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get all tasks for the project
    const tasksResult = await query(
      'SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at DESC',
      [project_id]
    );

    const project = projectResult.rows[0];
    const tasks = tasksResult.rows;

    // Analyze with AI
    const analysis = await analyzeProject(project.title, tasks);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('AI analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze project' },
      { status: 500 }
    );
  }
}
