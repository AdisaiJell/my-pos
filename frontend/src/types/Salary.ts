import type { User } from './User'
type Salary = {
  id?: number
  payDate: string
  payMonth: string
  paymentType: string
  deduction: number
  bonus: number
  total: number
  user: User | null
}

export type { Salary }
