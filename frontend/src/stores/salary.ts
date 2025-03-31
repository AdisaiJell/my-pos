import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Salary } from '@/types/Salary'
import salaryService from '@/services/salary'
import { useLoadingStore } from './loading'


export const useSalaryStore = defineStore('salary', () => {
  const indexInfo = ref(0)
  const loadingStore = useLoadingStore()
  const delDialogSalaryInfo = ref(false)
  const delItem = ref<Salary>()
  const salaryPayment = ref<Salary>({
    payDate: new Date().toISOString().substr(0, 10),
    payMonth: '',
    paymentType: "พร้อมเพย์",
    deduction: 0,
    bonus: 0,
    total: 0,
    user: null
  })

  const initialSalary: Salary = {
    payDate: new Date().toISOString().substr(0, 10),
    payMonth: '',
    paymentType: "พร้อมเพย์",
    deduction: 0,
    bonus: 0,
    total: 0,
    user: null
  }

  const salaries = ref<Salary[]>([])

  async function getSalaries() {
    loadingStore.doLoad()
    const res = await salaryService.getSalaries()
    salaries.value = res.data
    loadingStore.finishLoad()
  }

  async function getSalary(id: number) {
    const res = await salaryService.getSalary(id)
    editedSalary.value = res.data
  }

  function closeDelDialog() {
    delDialogSalaryInfo.value = false
    clear()
  }

  // function deleteItem() {
  //   const index = salaries.value.findIndex((i) => i.id === delItem.value?.id)
  //   if (index !== -1) {
  //     salaries.value.splice(index, 1)
  //   }

  //   closeDelDialog()
  // }

  async function saveSalary() {
    loadingStore.doLoad()
    const salary = editedSalary.value
    console.log(salary)
    if (!salary.id) {
      console.log('Post', JSON.stringify(salary))
      await salaryService.saveSlary(salary)
    }
    loadingStore.finishLoad()
  }

  const editedSalary = ref<Salary>(JSON.parse(JSON.stringify(initialSalary)))

  function clear() {
    editedSalary.value = Object.assign({}, salaryPayment.value)
  }

  return {
    editedSalary,
    indexInfo,
    clear,
    delDialogSalaryInfo,
    // deleteItem,
    closeDelDialog,
    delItem,
    getSalaries,
    salaries,
    getSalary,
    saveSalary,
    salaryPayment
  }
})
