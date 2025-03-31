import http from './http'

function getBranches() {
  return http.get('/branches')
}

function getBranch(id: number) {
  return http.get(`/branches/${id}`)
}

export default { getBranches, getBranch }
