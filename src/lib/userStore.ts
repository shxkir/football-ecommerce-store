import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { FieldValue } from 'firebase-admin/firestore';
import { getFirestoreDb } from '@/lib/firebaseAdmin';

export type StoredUser = {
  id: string;
  email: string;
  password: string;
  name?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type CreateUserPayload = {
  email: string;
  password: string;
  name?: string | null;
};

type LocalStoreShape = {
  users: StoredUser[];
  updatedAt: string;
};

const LOCAL_STORE_DIR = path.join(process.cwd(), '.data');
const LOCAL_STORE_FILE = path.join(LOCAL_STORE_DIR, 'users.json');

function isPlaceholder(value?: string | null) {
  if (!value) {
    return true;
  }
  const trimmed = value.trim().replace(/^"|"$/g, '');
  if (!trimmed) {
    return true;
  }
  return trimmed === 'your-project-id' || trimmed === 'firebase-adminsdk@example.iam.gserviceaccount.com' || trimmed.includes('...');
}

const firebaseConfigured = !isPlaceholder(process.env.FIREBASE_PROJECT_ID) && !isPlaceholder(process.env.FIREBASE_CLIENT_EMAIL) && !isPlaceholder(process.env.FIREBASE_PRIVATE_KEY);

async function ensureLocalStoreFile() {
  await fs.mkdir(LOCAL_STORE_DIR, { recursive: true });
  try {
    await fs.access(LOCAL_STORE_FILE);
  } catch {
    const initial: LocalStoreShape = { users: [], updatedAt: new Date().toISOString() };
    await fs.writeFile(LOCAL_STORE_FILE, JSON.stringify(initial, null, 2), 'utf8');
  }
}

async function readLocalUsers(): Promise<StoredUser[]> {
  await ensureLocalStoreFile();
  try {
    const raw = await fs.readFile(LOCAL_STORE_FILE, 'utf8');
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as Partial<LocalStoreShape> | StoredUser[];
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (parsed && Array.isArray(parsed.users)) {
      return parsed.users;
    }
    return [];
  } catch {
    return [];
  }
}

async function writeLocalUsers(users: StoredUser[]) {
  const payload: LocalStoreShape = { users, updatedAt: new Date().toISOString() };
  await ensureLocalStoreFile();
  await fs.writeFile(LOCAL_STORE_FILE, JSON.stringify(payload, null, 2), 'utf8');
}

async function findUserLocally(email: string) {
  const users = await readLocalUsers();
  return users.find((user) => user.email === email) ?? null;
}

async function createUserLocally(payload: CreateUserPayload) {
  const users = await readLocalUsers();
  const user: StoredUser = {
    id: randomUUID(),
    email: payload.email,
    password: payload.password,
    name: payload.name ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(user);
  await writeLocalUsers(users);
  return user;
}

async function findUserInFirestore(email: string) {
  const firestore = getFirestoreDb();
  const snapshot = await firestore.collection('users').where('email', '==', email).limit(1).get();
  if (snapshot.empty) {
    return null;
  }
  const doc = snapshot.docs[0];
  return { id: doc.id, ...(doc.data() as StoredUser) };
}

async function createUserInFirestore(payload: CreateUserPayload) {
  const firestore = getFirestoreDb();
  const docRef = firestore.collection('users').doc();
  await docRef.set({
    email: payload.email,
    password: payload.password,
    name: payload.name ?? null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return {
    id: docRef.id,
    email: payload.email,
    password: payload.password,
    name: payload.name ?? null,
  };
}

export async function findUserByEmail(email: string) {
  if (firebaseConfigured) {
    return findUserInFirestore(email);
  }
  return findUserLocally(email);
}

export async function createUser(payload: CreateUserPayload) {
  if (firebaseConfigured) {
    return createUserInFirestore(payload);
  }
  return createUserLocally(payload);
}

async function updateUserPasswordLocally(email: string, newPassword: string) {
  const users = await readLocalUsers();
  const user = users.find((u) => u.email === email);
  if (!user) {
    throw new Error('User not found');
  }
  user.password = newPassword;
  user.updatedAt = new Date().toISOString();
  await writeLocalUsers(users);
}

async function updateUserPasswordInFirestore(email: string, newPassword: string) {
  const firestore = getFirestoreDb();
  const snapshot = await firestore.collection('users').where('email', '==', email).limit(1).get();
  if (snapshot.empty) {
    throw new Error('User not found');
  }
  const doc = snapshot.docs[0];
  await doc.ref.update({
    password: newPassword,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function updateUserPassword(email: string, newPassword: string) {
  if (firebaseConfigured) {
    return updateUserPasswordInFirestore(email, newPassword);
  }
  return updateUserPasswordLocally(email, newPassword);
}

export function isFirestoreUserStoreEnabled() {
  return firebaseConfigured;
}
