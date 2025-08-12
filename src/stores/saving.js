import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import savingService from '@/services/savingService';

export const useSavingStore = defineStore('savings', () => {
  // state
  const total = ref(0);
  const history = ref([]); // [{categoryId,title,amount,date,startDate,endDate}]
  const loading = ref(false);
  const error = ref(null);

  // 카테고리 ID -> 카테고리명 매핑
  const categoryIdMap = {
    1: '배달음식',
    2: '카페', 
    3: '쇼핑',
    4: '택시',
    5: '편의점',
    6: '문화',
    7: '술',
    8: '교통',
    9: '의료',
    10: '생활',
    11: '식비',
    12: '그외'
  };

  // getters
  const groupedByDate = computed(() => {
    const groups = {};
    history.value.forEach((h) => {
      if (!groups[h.date]) groups[h.date] = [];
      groups[h.date].push(h);
    });
    return groups;
  });

  const totalFormatted = computed(() => total.value?.toLocaleString() || '0');

  // dto mapper
  const mapSavingDTO = (dto) => {
    const start = dto.startDate ? new Date(dto.startDate) : null;
    const end = dto.endDate ? new Date(dto.endDate) : null;
    const base = end || start || new Date();
    const categoryName = categoryIdMap[dto.categoryId] || '그외';
    
    // endDate를 month/date 형태로 포맷팅 (예: 12/25)
    const endDateFormatted = end 
      ? `${end.getMonth() + 1}/${end.getDate()}`
      : '';
    
    // 시간을 24시간 형식으로 포맷팅 (예: 14:30)
    const timeFormatted = base.toLocaleTimeString('ko-KR', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    return {
      categoryId: dto.categoryId,
      title: dto.title,
      name: dto.title, // TransactionCard에서 사용
      category: categoryName, // 아이콘 결정용 - 실제 카테고리명으로 복원
      categoryDisplay: endDateFormatted, // 화면 표시용 - endDate (month/date)
      amount: dto.saving ?? 0,
      isSaving: true, // 저금통 데이터임을 표시
      time: timeFormatted, // 24시간 형식
      startDate: start,
      endDate: end,
      date: base.toISOString().split('T')[0],
    };
  };

  // actions
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const [t, list] = await Promise.all([
        savingService.getTotal(),
        savingService.getHistory(),
      ]);
      total.value = Number(t) || 0;
      history.value = (list || [])
        .map(mapSavingDTO)
        .sort((a, b) => (a.date < b.date ? 1 : -1));
      console.log('저금통 API 응답 - total:', total);
      console.log('저금통 API 응답 - history:', history);
    } catch (e) {
      error.value = e.message || '저금통 불러오기 실패';
      total.value = 0;
      history.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function save(userChallengeId) {
    await savingService.save(userChallengeId);
    await fetchAll(); // 반영 후 갱신
  }

  return {
    // state
    total,
    history,
    loading,
    error,
    // getters
    groupedByDate,
    totalFormatted,
    // actions
    fetchAll,
    save,
  };
});
