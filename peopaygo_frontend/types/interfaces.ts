import { ROLES } from "./roles"

export interface User {
  accessToken: string,
  user: {
    id: number,
    email: string,
    role: ROLES,
    company: string,
    createdAt: Date | string,
    updated_at: Date | string
  }
}