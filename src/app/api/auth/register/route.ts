import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '@/lib/userStore';

const MIN_PASSWORD = 6;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    const emailRaw = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const passwordRaw = typeof body.password === 'string' ? body.password : '';

    if (!emailRaw || !passwordRaw) {
      return NextResponse.json({ message: 'Email and password are required.' }, { status: 400 });
    }
    if (passwordRaw.length < MIN_PASSWORD) {
      return NextResponse.json({ message: `Password must be at least ${MIN_PASSWORD} characters.` }, { status: 400 });
    }

    const existing = await findUserByEmail(emailRaw);
    if (existing) {
      return NextResponse.json({ message: 'An account with that email already exists.' }, { status: 409 });
    }

    const password = await bcrypt.hash(passwordRaw, 10);
    const user = await createUser({
      email: emailRaw,
      password,
      name: fullName || null,
    });

    return NextResponse.json({ id: user.id, email: user.email, name: user.name ?? null }, { status: 201 });
  } catch (error) {
    console.error('[auth.register]', error);
    return NextResponse.json({ message: 'Failed to create account.' }, { status: 500 });
  }
}
