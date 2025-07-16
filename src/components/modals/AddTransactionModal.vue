<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
    <div class="modal custom-modal bg-white p-4 border rounded shadow">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="mb-0 fs-5 fw-bold">
          {{ isEditMode ? '거래 수정' : '거래 추가' }}
        </h3>
        <button
          class="btn btn-close"
          aria-label="닫기"
          @click="handleClose"
        ></button>
      </div>

      <div class="mb-3 d-flex gap-2">
        <button
          class="btn flex-grow-1"
          :class="type === 'income' ? 'btn-success' : 'btn-outline-success'"
          @click="type = 'income'"
        >
          <i class="fas fa-plus-circle me-1"></i> 수입
        </button>
        <button
          class="btn flex-grow-1"
          :class="type === 'expense' ? 'btn-danger' : 'btn-outline-danger'"
          @click="type = 'expense'"
        >
          <i class="fas fa-minus-circle me-1"></i> 지출
        </button>
      </div>

      <div class="mb-3">
        <label for="modal-date" class="form-label small">날짜</label>
        <input
          id="modal-date"
          v-model="date"
          type="date"
          class="form-control"
          :class="{ 'is-invalid': showError && !date }"
        />
        <div v-if="showError && !date" class="invalid-feedback">
          날짜를 선택해주세요.
        </div>
      </div>

      <div class="mb-3">
        <label for="modal-amount" class="form-label small">금액</label>
        <input
          id="modal-amount"
          v-model="amount"
          type="number"
          class="form-control"
          :class="{ 'is-invalid': showError && !amount }"
          placeholder="금액 입력"
          min="0"
        />
        <div v-if="showError && !amount" class="invalid-feedback">
          금액을 입력해주세요.
        </div>
      </div>

      <div class="mb-3">
        <label for="modal-category" class="form-label small">카테고리</label>
        <select
          id="modal-category"
          v-model="selectedCategoryId"
          class="form-select"
          :class="{ 'is-invalid': showError && !selectedCategoryId }"
        >
          <option value="" disabled>-- 카테고리 선택 --</option>
          <option v-for="cat in categoryOptions" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
        <div v-if="showError && !selectedCategoryId" class="invalid-feedback">
          카테고리를 선택해주세요.
        </div>
      </div>

      <div class="mb-4">
        <label for="modal-memo" class="form-label small">메모</label>
        <input
          id="modal-memo"
          v-model="memo"
          type="text"
          class="form-control"
          placeholder="메모 (선택 사항)"
        />
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-secondary flex-grow-1" @click="handleClose">
          <i class="fas fa-times me-1"></i> 취소
        </button>
        <button class="btn btn-custom flex-grow-1" @click="handleSave">
          <i class="fas fa-save me-1"></i> {{ isEditMode ? '수정' : '저장' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useTransactionStore } from '@/store/transactionStore' // 경로 확인

const store = useTransactionStore()

const props = defineProps({
  isOpen: Boolean, // 모달 열림 상태 (애니메이션 등에 필요할 수 있음)
  editTransaction: {
    // 수정할 거래 데이터 (없으면 null)
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

// --- 로컬 폼 상태 ---
const type = ref('expense') // 기본값을 '지출'로 변경 (선호에 따라)
const date = ref('')
const amount = ref('')
const selectedCategoryId = ref('') // 카테고리 ID를 저장할 ref
const memo = ref('')
const showError = ref(false) // 유효성 검사 에러 표시 여부

// 수정 모드인지 계산
const isEditMode = computed(() => !!props.editTransaction)

// --- 카테고리 옵션 계산 (수정됨) ---
const categoryOptions = computed(() => {
  // store.categories에서 현재 type (income/expense)에 맞는 카테고리만 필터링
  // 카테고리 객체에 type 속성이 있다고 가정 (예: { id: 'exp1', name: '식비', type: 'expense', icon: '...' })
  // 만약 type 속성이 없다면, id prefix ('exp'/'inc')로 구분해야 함
  return store.categories.filter(cat => {
    // category 객체에 type 속성이 있다면:
    // return cat.type === type.value;

    // category 객체에 type 속성이 없고 id로 구분해야 한다면:
    if (type.value === 'income') {
      return cat.id.startsWith('inc')
    } else {
      return cat.id.startsWith('exp')
    }
  })
})

// --- 폼 초기화 함수 ---
const resetForm = () => {
  // 수정 모드가 아니고, props.editTransaction이 없을 때만 초기화
  if (!isEditMode.value) {
    type.value = 'expense' // 기본값
    date.value = new Date().toISOString().split('T')[0] // 오늘 날짜
    amount.value = ''
    selectedCategoryId.value = '' // 카테고리 ID 초기화
    memo.value = ''
  }
  showError.value = false // 에러 표시 초기화
}

// --- 수정 데이터 로드 (수정됨) ---
// props.editTransaction이 변경될 때 폼 데이터 채우기
watch(
  () => props.editTransaction,
  newVal => {
    if (newVal) {
      console.log('Editing transaction:', newVal) // 수정 데이터 확인
      type.value = newVal.type
      // 날짜 형식이 YYYY-MM-DD 인지 확인 필요, 아닐 경우 변환
      date.value = newVal.date.split('T')[0] // 'YYYY-MM-DD' 형식으로 가정
      amount.value = newVal.amount
      selectedCategoryId.value = newVal.categoryId // categoryId 설정
      memo.value = newVal.memo || ''
      showError.value = false // 수정 시작 시 에러 숨김
    } else {
      // editTransaction이 null이 되면 (닫히거나 추가 모드) 폼 초기화
      resetForm()
    }
  },
  { immediate: true } // 컴포넌트 로드 시 즉시 실행
)

// --- 저장 처리 (수정됨) ---
const handleSave = async () => {
  // 유효성 검사
  showError.value = true // 일단 에러 표시 플래그 활성화
  if (
    !date.value ||
    !amount.value ||
    amount.value <= 0 ||
    !selectedCategoryId.value
  ) {
    console.log('Validation failed:', {
      date: date.value,
      amount: amount.value,
      categoryId: selectedCategoryId.value
    })
    return // 필수 값 없으면 중단
  }
  showError.value = false // 유효성 통과

  const transactionData = {
    type: type.value,
    date: date.value,
    amount: Number(amount.value),
    categoryId: selectedCategoryId.value, // categoryId 사용
    memo: memo.value
  }
  console.log('Saving transaction:', transactionData)

  try {
    let result
    if (isEditMode.value) {
      console.log('Calling updateTransaction')
      result = await store.updateTransaction(
        props.editTransaction.id,
        transactionData
      )
    } else {
      console.log('Calling addTransaction')
      result = await store.addTransaction(transactionData)
    }

    // 저장/수정 성공 시
    if (result.success) {
      handleClose(true) // 저장 후 닫기 (save 이벤트 발생 O)
    } else {
      // 실패 시 스토어에서 반환된 에러 메시지 사용
      alert(`저장 실패: ${result.error || '알 수 없는 오류'}`)
    }
  } catch (error) {
    // 네트워크 오류 등 예외 처리
    console.error('거래 저장/수정 중 예외 발생:', error)
    alert('거래 처리 중 오류가 발생했습니다.')
  }
}

// --- 모달 닫기 ---
// isSaved: 저장 성공 후 닫히는 경우 true
const handleClose = (isSaved = false) => {
  resetForm() // 닫기 전에 폼 초기화
  if (isSaved) {
    emit('save') // 저장 성공 시 save 이벤트 발생
  }
  emit('close') // 항상 close 이벤트 발생
}

// 컴포넌트가 처음 마운트될 때 폼 초기화
// (watch immediate:true 때문에 이미 초기화될 수 있으므로 필요 없을 수도 있음)
// onMounted(() => {
//   resetForm();
// });
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  animation: fadeIn 0.2s ease-out;
}

.custom-modal {
  position: relative;
  /* width: 90%; */
  max-width: 400px !important;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
  margin: 1.75rem auto;
  padding: 1.25rem;
  max-height: 70vh; /* 최대 높이를 뷰포트 높이의 70%로 제한 (값 조절 가능) */
  overflow-y: auto;
}

.custom-modal .modal-header {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.custom-modal .modal-body {
  padding: 1.25rem;
}

.custom-modal .modal-footer {
  padding: 1rem;
  gap: 0.5rem;
  border-top: 1px solid #dee2e6;
}

/* 애니메이션 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 모바일 대응 */
@media (max-width: 767.98px) {
  .custom-modal {
    margin: 1rem auto;
    padding: 1rem;
    max-height: 70vh;
  }

  .custom-modal .modal-header {
    padding: 0.75rem;
  }

  .custom-modal .modal-body {
    padding: 1rem;
  }

  .custom-modal .modal-footer {
    padding: 0.75rem;
  }
}

/* Bootstrap is-invalid 스타일과 유사하게 보이기 위한 기본 스타일 */
.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}

/* 버튼 아이콘 정렬 */
.btn i {
  vertical-align: middle;
}
.modal {
  display: block !important; /* 또는 display: flex 등 필요한 값으로, !important가 필요할 수 있음 */
}
.btn-custom {
  --bs-btn-color: #fff;
  --bs-btn-bg: #3eaed6;
  --bs-btn-border-color: #3eaed6;
  --bs-btn-hover-color: #fff;
  --bs-btn-hover-bg: #359abf;
  --bs-btn-hover-border-color: #3292b6;
  --bs-btn-active-color: #fff;
  --bs-btn-active-bg: #3292b6;
  --bs-btn-active-border-color: #2f88aa;
}
</style>
