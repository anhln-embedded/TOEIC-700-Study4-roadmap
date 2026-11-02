import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

export interface UserRecord {
  id: string;
  username: string;
  passwordHash: string;
  salt: string;
  progress: Record<string, unknown>;
  theme: 'light' | 'dark';
  createdAt: string;
  updatedAt: string;
}

interface DatabaseStructure {
  users: Record<string, UserRecord>; // keyed by username
}

function ensureDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify({ users: {} }, null, 2), 'utf-8');
  }
}

function readDb(): DatabaseStructure {
  ensureDb();
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw || '{"users":{}}');
  } catch (e) {
    console.error('Error reading users db', e);
    return { users: {} };
  }
}

function writeDb(db: DatabaseStructure) {
  ensureDb();
  fs.writeFileSync(USERS_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export function createUser(username: string, password: string): UserRecord {
  const db = readDb();
  const lowerUser = username.trim().toLowerCase();
  if (db.users[lowerUser]) {
    throw new Error('Tài khoản đã tồn tại.');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const now = new Date().toISOString();

  const user: UserRecord = {
    id: crypto.randomUUID(),
    username: lowerUser,
    passwordHash,
    salt,
    progress: {},
    theme: 'light',
    createdAt: now,
    updatedAt: now,
  };

  db.users[lowerUser] = user;
  writeDb(db);
  return user;
}

export function verifyUser(username: string, password: string): UserRecord | null {
  const db = readDb();
  const lowerUser = username.trim().toLowerCase();
  const user = db.users[lowerUser];
  if (!user) return null;

  const testHash = hashPassword(password, user.salt);
  if (testHash === user.passwordHash) {
    return user;
  }
  return null;
}

export function getUser(username: string): UserRecord | null {
  const db = readDb();
  return db.users[username.trim().toLowerCase()] || null;
}

export function updateUserProgress(username: string, progress: Record<string, unknown>, theme: 'light' | 'dark'): boolean {
  const db = readDb();
  const lowerUser = username.trim().toLowerCase();
  const user = db.users[lowerUser];
  if (!user) return false;

  user.progress = progress;
  user.theme = theme;
  user.updatedAt = new Date().toISOString();
  writeDb(db);
  return true;
}
