import { savingAPI } from '../utils/api';

const mapSavingDTO = (dto) => ({
  categoryId: dto.categoryId,
  title: dto.title,
  startDate: dto.startDate ? new Date(dto.startDate) : null,
  endDate: dto.endDate ? new Date(dto.endDate) : null,
  saving: dto.saving, // Long
  period: dto.period, // Long
});

const unwrap = (res) => res;

const handleError = (e) => {
  // 필요하면 토스트/로그 추가
  const status = e?.response?.status;
  const message =
    e?.response?.data?.message ||
    e?.message ||
    '요청 처리 중 오류가 발생했어요.';
  const err = new Error(message);
  err.status = status;
  throw err;
};

export const savingService = {
  /** 총 저축액(Long) */
  async getTotal() {
    try {
      const res = await savingAPI.getTotal();
      console.log('[savingService.getTotal] response:', res);
      return unwrap(res); // number(Long)
    } catch (e) {
      handleError(e);
    }
  },

  /** 저축 내역(List<SavingDTO>) */
  async getHistory() {
    try {
      const res = await savingAPI.getHistory();
      const list = unwrap(res) || [];
      console.log('[savingService.getHistory] response:', res);
      return list.map(mapSavingDTO);
    } catch (e) {
      handleError(e);
    }
  },

  /**
   * 특정 참여 챌린지(userChallengeId) 금액을 저금통에 반영
   * 성공 시 서버 메시지("저금통 저장 완료") 반환
   */
  async save(userChallengeId) {
    try {
      if (!userChallengeId) throw new Error('userChallengeId가 필요해요.');
      const res = await savingAPI.save(userChallengeId);
      return unwrap(res); // "저금통 저장 완료"
    } catch (e) {
      handleError(e);
    }
  },
};

export default savingService;
