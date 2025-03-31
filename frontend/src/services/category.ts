import http from './http'

function getCategories() {
  return http.get('/categories')
}

function getCategory(id: number) {
  return http.get(`/categories/${id}`)
}

export default { getCategories, getCategory }
