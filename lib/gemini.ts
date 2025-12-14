import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateTaskSuggestions(
  projectTitle: string,
  projectDescription: string
): Promise<any[]> {
  try {
    console.log('Generating task suggestions...', projectTitle, projectDescription);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a project management expert. Given a project titled "${projectTitle}" with description: "${projectDescription}", 
    generate 5-7 relevant tasks that would help complete this project successfully.
    
    For each task, provide:
    - title: A clear, actionable task title (concise, under 100 characters)
    - description: A detailed description explaining what needs to be done, why it's important, and any relevant details (2-3 sentences)
    - priority: high, medium, or low
    - estimatedHours: Estimated hours to complete (as a number)
    
    Return ONLY a valid JSON array with no markdown formatting or additional text. Example format:
    [
      {"title": "Task name", "description": "Detailed description of what needs to be done and why", "priority": "high", "estimatedHours": 8},
      {"title": "Another task", "description": "Another detailed description with context", "priority": "medium", "estimatedHours": 4}
    ]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Raw AI response:', text);
    // Clean and parse the response
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const suggestions = JSON.parse(cleanedText);
    
    return suggestions;
  } catch (error) {
    console.error('Gemini AI error:', error);
    throw new Error('Failed to generate task suggestions');
  }
}

export async function analyzeProject(
  projectTitle: string,
  tasks: any[]
): Promise<{
  progress: number;
  insights: string[];
  recommendations: string[];
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const tasksInfo = tasks.map(t => ({
      title: t.title,
      status: t.status,
      priority: t.priority,
      estimatedHours: t.estimated_hours
    }));

    const prompt = `Analyze this project: "${projectTitle}"
    
    Tasks (${tasks.length} total):
    ${JSON.stringify(tasksInfo, null, 2)}
    
    Provide analysis in this EXACT JSON format with no markdown formatting:
    {
      "progress": <number 0-100>,
      "insights": ["insight 1", "insight 2", "insight 3"],
      "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
    }
    
    Make insights specific and actionable based on the actual task data.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean and parse the response
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const analysis = JSON.parse(cleanedText);
    
    return analysis;
  } catch (error) {
    console.error('Gemini AI analysis error:', error);
    
    // Fallback analysis if AI fails
    const completed = tasks.filter(t => t.status === 'completed').length;
    const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
    
    return {
      progress,
      insights: [
        `${completed} of ${tasks.length} tasks completed`,
        'Continue working on high-priority tasks',
        'Regular progress updates recommended'
      ],
      recommendations: [
        'Break down complex tasks into smaller chunks',
        'Schedule regular team check-ins',
        'Update task statuses daily'
      ]
    };
  }
}