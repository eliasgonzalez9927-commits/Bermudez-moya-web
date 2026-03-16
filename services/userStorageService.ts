
import { User } from '../types';
import { MOCK_USERS } from '../constants';

const STORAGE_KEY = 'bm_users';

export const getStoredUsers = (): User[] => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as User[];
    return MOCK_USERS.map(u => {
      const override = stored.find(s => s.id === u.id);
      return override ? { ...u, ...override } : u;
    });
  } catch {
    return MOCK_USERS;
  }
};

export const updateUserProfile = (userId: string, updates: Partial<Omit<User, 'id'>>): User => {
  const users = getStoredUsers();
  const updatedUser = { ...users.find(u => u.id === userId)!, ...updates };

  const stored: User[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const idx = stored.findIndex(s => s.id === userId);
  if (idx >= 0) {
    stored[idx] = updatedUser;
  } else {
    stored.push(updatedUser);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  return updatedUser;
};
