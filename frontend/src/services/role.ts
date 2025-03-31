import http from './http'

function getRoles() {
  return http.get('/roles')
}

function getRole(id: number) {
  return http.get(`/roles/${id}`)
}

export default { getRoles, getRole }
