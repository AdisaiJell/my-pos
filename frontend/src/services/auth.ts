import http from './http'

function login(email: string, password: string) {
  return http.post('/auth/login', { email, password })
}

export default { login }
