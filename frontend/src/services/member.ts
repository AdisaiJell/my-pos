import type { Member } from '@/types/Member'
import http from './http'

function saveMember(member: Member) {
  return http.post('/members', member)
}

function updateMember(member: Member) {
  return http.patch(`/members/${member.id}`, member)
}

function deleteMember(member: Member) {
  return http.delete('/members/' + member.id)
}

function getMembers() {
  return http.get('/members')
}

function getMember(id: number) {
  return http.get(`/members/${id}`)
}

function getMemberByTel(tel: string) {
  if (tel === '') {
    return http.get(`/members/tel/''`)
  }
  return http.get(`/members/tel/${tel}`)
}

export default { getMembers, getMember, saveMember, updateMember, deleteMember, getMemberByTel }
