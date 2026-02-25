import { api } from './client'
import { TokenResponse } from '../types'

export const requestCode = async (phone_number: string) => (await api.post('/auth/request-code', { phone_number })).data
export const login = async (phone_number: string, code: string): Promise<TokenResponse> =>
  (await api.post('/auth/login', { phone_number, code })).data
