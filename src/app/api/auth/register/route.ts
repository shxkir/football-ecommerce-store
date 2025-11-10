import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { FieldValue } from 'firebase-admin/firestore';
import { getFirestoreDb } from '@/lib/firebaseAdmin';

const MIN_PASSWORD = 6;

export async function POST(request: Request) {
  try {
    const firestore = getFirestoreDb();
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

    const existing = await firestore.collection('users').where('email', '==', emailRaw).limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ message: 'An account with that email already exists.' }, { status: 409 });
    }

    const password = await bcrypt.hash(passwordRaw, 10);
    const usersCollection = firestore.collection('users');
    const docRef = usersCollection.doc();
    await docRef.set({
      email: emailRaw,
      password,
      name: fullName || null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ id: docRef.id, email: emailRaw, name: fullName || null }, { status: 201 });
  } catch (error) {
    console.error('[auth.register]', error);
    return NextResponse.json({ message: 'Failed to create account.' }, { status: 500 });
  }
}
