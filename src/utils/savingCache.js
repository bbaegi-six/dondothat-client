// 저금통 데이터 캐싱 유틸리티

const SAVING_CACHE_KEY = 'saving_account_cache';

export class SavingCache {
  // 캐시 데이터 저장
  static set(data) {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem(SAVING_CACHE_KEY, JSON.stringify(cacheData));
      console.log('저금통 데이터 캐시 저장 완료');
    } catch (error) {
      console.warn('저금통 캐시 저장 실패:', error);
    }
  }

  // 캐시 데이터 조회
  static get() {
    try {
      const cached = localStorage.getItem(SAVING_CACHE_KEY);
      if (!cached) return null;

      const cacheData = JSON.parse(cached);
      console.log('저금통 캐시 데이터 사용');
      return cacheData.data;
    } catch (error) {
      console.warn('저금통 캐시 조회 실패:', error);
      this.clear();
      return null;
    }
  }

  // 캐시 유효성 확인
  static isValid() {
    return this.get() !== null;
  }

  // 캐시 삭제 (새로고침 버튼이나 챌린지 완료 시 사용)
  static clear() {
    try {
      localStorage.removeItem(SAVING_CACHE_KEY);
      console.log('저금통 캐시 삭제 완료');
    } catch (error) {
      console.warn('저금통 캐시 삭제 실패:', error);
    }
  }

  // 챌린지 완료 시 캐시 무효화
  static invalidateOnChallengeComplete() {
    this.clear();
    console.log('챌린지 완료로 인한 저금통 캐시 무효화');
  }

  // 새로고침 버튼 클릭 시 캐시 무효화
  static invalidateOnRefresh() {
    this.clear();
    console.log('사용자 새로고침으로 인한 저금통 캐시 무효화');
  }

  // 캐시 정보 조회 (디버깅용)
  static getInfo() {
    const cached = localStorage.getItem(SAVING_CACHE_KEY);
    if (!cached) return '캐시 없음';
    
    try {
      const cacheData = JSON.parse(cached);
      const elapsed = Date.now() - cacheData.timestamp;
      const elapsedMinutes = Math.floor(elapsed / (1000 * 60));
      
      return `캐시 생성: ${elapsedMinutes}분 전`;
    } catch {
      return '캐시 데이터 오류';
    }
  }
}