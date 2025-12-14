import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthUser } from '@/lib/auth';
import { generateTaskSuggestions } from '@/lib/gemini';
import { db } from '@/lib/db';
import { projects } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';

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
    console.log('Generating suggestions for project:', project_id);

    // Get project details
    const projectResult = await db
      .select({ title: projects.title, description: projects.description })
      .from(projects)
      .where(and(eq(projects.id, project_id), eq(projects.createdBy, user.userId)));
    
    console.log('Project details retrieved:', projectResult);
    if (projectResult.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const project = projectResult[0];

    // Generate AI suggestions
    const suggestions = await generateTaskSuggestions(
      project.title,
      project.description || ''
    );
    console.log('AI suggestions generated:', suggestions);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('AI suggestions error:', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
