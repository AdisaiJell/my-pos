import http from './http'

function getSizes() {
  return http.get('/sizes')
}

function getSize(id: number) {
  return http.get(`/sizes/${id}`)
}

export default { getSizes, getSize }
