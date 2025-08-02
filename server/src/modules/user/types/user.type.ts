import { ApiResponse } from '#types/response';
/**
 * DTO for creating a user
 */

export interface CreateUserDTO {
  username: string;
  password: string;
}

/**
 * Safe usesr response without password
 */

export interface UserResponse {
  id: string;
  username: string;
  createdAt: Date;
}

/**
 * Typed API response for User
 */

export type UserApiResponse = ApiResponse<UserResponse | UserResponse[]>;
