import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = false;

interface ContactRequestBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequestBody = await request.json();

    const { name, email, subject, message } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Name is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json(
        { error: 'Email is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== 'string' || subject.trim() === '') {
      return NextResponse.json(
        { error: 'Subject is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required and cannot be empty' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Request parsing error:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
