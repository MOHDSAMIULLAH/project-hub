import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthUser } from '@/lib/auth';
import { generateTaskSuggestions } from '@/lib/gemini';
import { query } from '@/lib/db';

const suggestionSchema = z.object({
  project_id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { project_id } = suggestionSchema.parse(body);

    // Get project details
    const projectResult = await query(
      'SELECT title, description FROM projects WHERE id = $1 AND created_by = $2',
      [project_id, user.userId]
    );

    if (projectResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const project = projectResult.rows[0];

    // Generate AI suggestions
    const suggestions = await generateTaskSuggestions(
      project.title,
      project.description
    );

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('AI suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
