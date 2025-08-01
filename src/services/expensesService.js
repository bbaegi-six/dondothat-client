import { expensesAPI } from '@/utils/api'

export const expensesService = {
  // 지출 내역 조회
  async fetchExpenses(filters = {}) {
    try {
      const params = {
        page: filters.page || 1,
        limit: filters.limit || 50,
        type: filters.type,
        categoryId: filters.categoryId,
        startDate: filters.dateRange?.start,
        endDate: filters.dateRange?.end,
        minAmount: filters.amountRange?.min,
        maxAmount: filters.amountRange?.max
      }
      
      // null/undefined 값 제거
      Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === undefined) {
          delete params[key]
        }
      })
      
      return await expensesAPI.getAll(params)
    } catch (error) {
      throw new Error(`지출 내역 조회 실패: ${error.message}`)
    }
  },

  // 지출 내역 생성
  async createExpense(expenseData) {
    try {
      const data = {
        type: expenseData.type,
        amount: parseFloat(expenseData.amount),
        categoryId: parseInt(expenseData.categoryId),
        description: expenseData.description,
        date: expenseData.date
      }
      return await expensesAPI.create(data)
    } catch (error) {
      throw new Error(`지출 내역 생성 실패: ${error.message}`)
    }
  },

  // 지출 내역 수정
  async updateExpense(id, expenseData) {
    try {
      const data = {
        type: expenseData.type,
        amount: parseFloat(expenseData.amount),
        categoryId: parseInt(expenseData.categoryId),
        description: expenseData.description,
        date: expenseData.date
      }
      return await expensesAPI.update(id, data)
    } catch (error) {
      throw new Error(`지출 내역 수정 실패: ${error.message}`)
    }
  },

  // 지출 내역 삭제
  async deleteExpense(id) {
    try {
      return await expensesAPI.delete(id)
    } catch (error) {
      throw new Error(`지출 내역 삭제 실패: ${error.message}`)
    }
  },

  // 카테고리 조회
  async fetchCategories() {
    try {
      return await expensesAPI.getCategories()
    } catch (error) {
      throw new Error(`카테고리 조회 실패: ${error.message}`)
    }
  },
}

export default expensesService