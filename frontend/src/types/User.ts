import type { Branch } from './Branch'
import type { Role } from './Role'

type User = {
  id?: number
  email: string
  password: string
  fullName: string
  gender: string
  image: string
  role: Role //  admin, user
  salaryRate: number
  branch?: Branch
  files?: File[]
}

export type { User }
