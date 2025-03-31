import http from './http'

function getTypes() {
  return http.get('/types')
}

function getType(id: number) {
  return http.get(`/types/${id}`)
}

export default { getTypes, getType }
