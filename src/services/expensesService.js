import { expensesAPI } from '@/utils/api';

export const expensesService = {
  // 지출 내역 조회 (userId를 올바르게 전달하도록 수정)
  async fetchExpenses(filters = {}) {
    try {
      const params = {
        userId: 1, // 하드코딩된 userId 사용 (실제로는 인증된 사용자 ID 사용해야 함)
        page: filters.page || 1,
        limit: filters.limit || 50,
        categoryId: filters.categoryId,
        startDate: filters.dateRange?.start,
        endDate: filters.dateRange?.end,
        minAmount: filters.amountRange?.min,
        maxAmount: filters.amountRange?.max,
      };

      // null/undefined 값 제거
      Object.keys(params).forEach((key) => {
        if (params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      return await expensesAPI.getAll(params);
    } catch (error) {
      throw new Error(`지출 내역 조회 실패: ${error.message}`);
    }
  },

  // 지출 내역 생성
  async createExpense(expenseData) {
    try {
      // 카테고리명을 category_id로 변환하는 매핑
      const categoryMapping = {
        배달음식: 1,
        카페: 2,
        쇼핑: 3,
        택시: 4,
        편의점: 5,
        문화: 6,
        술: 7,
        교통: 8,
        의료: 9,
        생활: 10,
        식비: 11,
        그외: 12,
        수입: 13,
      };

      // 날짜와 시간을 합쳐서 완전한 DateTime으로 변환
      const dateTime = `${expenseData.date} ${expenseData.time || '00:00'}:00`;

      const data = {
        amount: parseFloat(expenseData.amount),
        categoryId: categoryMapping[expenseData.category] || 12, // 카테고리명을 ID로 변환, 기본값은 '그외'(12)
        description: expenseData.name || '거래내역', // name을 description으로 매핑, 기본값 설정
        expenditureDate: dateTime, // YYYY-MM-DD HH:MM:SS 형식으로 전송
        assetId: 1, // 임시로 첫 번째 asset_id 사용 (나중에 사용자별 자산 연동 필요)
      };
      return await expensesAPI.create(data);
    } catch (error) {
      throw new Error(`지출 내역 생성 실패: ${error.message}`);
    }
  },

  // 지출 내역 수정
  async updateExpense(id, expenseData) {
    try {
      // 카테고리명을 category_id로 변환하는 매핑 (생성과 동일)
      const categoryMapping = {
        배달음식: 1,
        카페: 2,
        쇼핑: 3,
        택시: 4,
        편의점: 5,
        문화: 6,
        술: 7,
        교통: 8,
        의료: 9,
        생활: 10,
        식비: 11,
        그외: 12,
        수입: 13,
      };

      // 날짜와 시간을 합쳐서 완전한 DateTime으로 변환 (수정 시에도 동일)
      const dateTime = `${expenseData.date} ${expenseData.time || '00:00'}:00`;

      const data = {
        amount: parseFloat(expenseData.amount),
        categoryId: categoryMapping[expenseData.category] || 12, // 카테고리명을 ID로 변환
        description: expenseData.name || '거래내역', // name을 description으로 매핑, 기본값 설정
        expenditureDate: dateTime, // YYYY-MM-DD HH:MM:SS 형식으로 전송
        assetId: 1, // 임시로 첫 번째 asset_id 사용 (나중에 사용자별 자산 연동 필요)
      };
      return await expensesAPI.update(id, data);
    } catch (error) {
      throw new Error(`지출 내역 수정 실패: ${error.message}`);
    }
  },

  // 지출 내역 삭제
  async deleteExpense(id) {
    try {
      return await expensesAPI.delete(id);
    } catch (error) {
      throw new Error(`지출 내역 삭제 실패: ${error.message}`);
    }
  },

  // 카테고리 조회
  async fetchCategories() {
    try {
      return await expensesAPI.getCategories();
    } catch (error) {
      throw new Error(`카테고리 조회 실패: ${error.message}`);
    }
  },
};

export default expensesService;
