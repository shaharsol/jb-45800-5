import { IUser, User } from '../models/User';

export async function findByIdWithAccessToken(id: string): Promise<IUser | null> {
  return User.findById(id).select('+githubAccessToken');
}
