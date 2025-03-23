import { findUserUploadDefaults } from "./db";
import { IUserUploadDefaults } from "./types";

export async function userUploadDefaults(userId: number): Promise<IUserUploadDefaults> {
  const [userUploadDefaults] = await findUserUploadDefaults(userId) as IUserUploadDefaults[];

  return userUploadDefaults;
}