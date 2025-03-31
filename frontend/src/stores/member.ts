import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Member } from '@/types/Member'
import { useReceiptStore } from './receipt'
import memberService from '@/services/member'
import { useLoadingStore } from './loading'

export const useMemberStore = defineStore('member', () => {
  const receiptStore = useReceiptStore()
  const loadingStore = useLoadingStore()
  const tel = ref('')

  const initialMember: Member = {
    name: '',
    tel: '',
    point: 0
  }

  const members = ref<Member[]>([])

  const editedMember = ref<Member>(JSON.parse(JSON.stringify(initialMember)))
  const openDialog = ref(false)
  const delDialog = ref(false)
  const receivePoint = ref(0)
  const usePoint = ref(0)
  const memberLoading = ref(false)

  const currentMember = ref<Member | null>(null)

  async function searchMember() {
    memberLoading.value = true
    const res = await memberService.getMemberByTel(tel.value)
    currentMember.value = res.data
    receiptStore.receipt.member = currentMember.value
    memberLoading.value = false
  }

  async function saveMember() {
    loadingStore.doLoad()
    const member = editedMember.value
    if (!member.id) {
      await memberService.saveMember(member)
    } else {
      await memberService.updateMember(member)
    }
    await getMembers()
    loadingStore.finishLoad()
  }

  async function deleteMember() {
    loadingStore.doLoad()
    const member = editedMember.value
    await memberService.deleteMember(member)
    await getMembers()
    loadingStore.finishLoad()
  }

  async function updateCurrentMember() {
    loadingStore.doLoad()
    if (currentMember.value) {
      const member = JSON.parse(JSON.stringify(currentMember.value))
      member.point -= usePoint.value
      member.point += receivePoint.value
      await memberService.updateMember(member)
    }
    loadingStore.finishLoad()
  }

  function clear() {
    usePoint.value = 0
    receivePoint.value = 0
    currentMember.value = null
    tel.value = ''
    editedMember.value = JSON.parse(JSON.stringify(initialMember))
  }

  async function getMembers() {
    loadingStore.doLoad()
    const res = await memberService.getMembers()
    members.value = res.data
    loadingStore.finishLoad()
  }

  async function getMember(id: number) {
    const res = await memberService.getMember(id)
    editedMember.value = res.data
  }

  return {
    members,
    memberLoading,
    receivePoint,
    openDialog,
    delDialog,
    currentMember,
    tel,
    editedMember,
    usePoint,
    searchMember,
    deleteMember,
    updateCurrentMember,
    clear,
    saveMember,
    getMembers,
    getMember
  }
})
