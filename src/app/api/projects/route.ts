import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust this import based on your database setup

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        featured: data.featured,
        images: data.images,
        technologies: data.technologies,
        githubLink: data.githubLink,
        liveLink: data.liveLink,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 