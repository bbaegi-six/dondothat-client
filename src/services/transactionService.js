import { transactionsAPI } from '@/utils/api'

// 실제 API 연동 시 사용할 서비스 함수들
export const transactionService = {
  // 거래 내역 조회
  async fetchTransactions(filters = {}) {
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
      
      return await transactionsAPI.getAll(params)
    } catch (error) {
      throw new Error(`거래 내역 조회 실패: ${error.message}`)
    }
  },

  // 거래 내역 생성
  async createTransaction(transactionData) {
    try {
      const data = {
        type: transactionData.type,
        amount: parseFloat(transactionData.amount),
        categoryId: parseInt(transactionData.categoryId),
        description: transactionData.description,
        date: transactionData.date
      }
      
      return await transactionsAPI.create(data)
    } catch (error) {
      throw new Error(`거래 내역 생성 실패: ${error.message}`)
    }
  },

  // 거래 내역 수정
  async updateTransaction(id, transactionData) {
    try {
      const data = {
        type: transactionData.type,
        amount: parseFloat(transactionData.amount),
        categoryId: parseInt(transactionData.categoryId),
        description: transactionData.description,
        date: transactionData.date
      }
      
      return await transactionsAPI.update(id, data)
    } catch (error) {
      throw new Error(`거래 내역 수정 실패: ${error.message}`)
    }
  },

  // 거래 내역 삭제
  async deleteTransaction(id) {
    try {
      return await transactionsAPI.delete(id)
    } catch (error) {
      throw new Error(`거래 내역 삭제 실패: ${error.message}`)
    }
  },

  // 카테고리 조회
  async fetchCategories() {
    try {
      return await transactionsAPI.getCategories()
    } catch (error) {
      throw new Error(`카테고리 조회 실패: ${error.message}`)
    }
  },

  // 카테고리 생성
  async createCategory(categoryData) {
    try {
      const data = {
        name: categoryData.name,
        type: categoryData.type,
        color: categoryData.color,
        icon: categoryData.icon
      }
      
      return await transactionsAPI.createCategory(data)
    } catch (error) {
      throw new Error(`카테고리 생성 실패: ${error.message}`)
    }
  }
}

export default transactionService