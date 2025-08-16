// 챌린지 관련 공통 유틸 함수들

// 티어 이미지 import
import tier00 from '@/assets/tier/tier_00.png';
import tier01 from '@/assets/tier/tier_01.png';
import tier02 from '@/assets/tier/tier_02.png';
import tier03 from '@/assets/tier/tier_03.png';
import tier04 from '@/assets/tier/tier_04.png';
import tier05 from '@/assets/tier/tier_05.png';
import tier06 from '@/assets/tier/tier_06.png';

// 티어 이미지 매핑
export const TIER_IMAGES = {
  0: tier00,
  1: tier01,
  2: tier02,
  3: tier03,
  4: tier04,
  5: tier05,
  6: tier06,
};

// 티어 이미지 가져오기
export function getTierImage(tierId) {
  return TIER_IMAGES[tierId] || tier00;
}

// 잠재 저금액 계산
export function calculatePotentialSavings(challengeType, days) {
  const categoryAverages = {
    cafe: 4500,
    delivery: 12000,
    taxi: 8000,
    CAFE_CHALLENGE: 4500,
    DELIVERY_CHALLENGE: 12000,
    TAXI_CHALLENGE: 8000,
  };

  const dailyAverage = categoryAverages[challengeType] || 5000;
  return dailyAverage * days;
}

// 챌린지 상태 텍스트 매핑
export const CHALLENGE_STATUS_TEXT = {
  ongoing: '진행 중',
  completed: '완료',
  failed: '실패',
  closed: '종료',
  NONE: '없음',
};

// 챌린지 상태 텍스트 가져오기
export function getChallengeStatusText(status) {
  return CHALLENGE_STATUS_TEXT[status] || '알 수 없음';
}

// 챌린지 메타데이터
export const CHALLENGE_METADATA = {
  cafe: {
    title: '카페 금지 챌린지',
    icon: 'fas fa-coffee',
    color: '#FF9595',
    categoryText: '카페',
  },
  delivery: {
    title: '배달음식 금지 챌린지',
    icon: 'fas fa-motorcycle',
    color: '#FF7376',
    categoryText: '배달음식',
  },
  taxi: {
    title: '택시 금지 챌린지',
    icon: 'fas fa-taxi',
    color: '#FFC457',
    categoryText: '택시',
  },
  CAFE_CHALLENGE: {
    title: '카페 금지 챌린지',
    icon: 'fas fa-coffee',
    color: '#FF9595',
    categoryText: '카페',
  },
  DELIVERY_CHALLENGE: {
    title: '배달음식 금지 챌린지',
    icon: 'fas fa-motorcycle',
    color: '#FF7376',
    categoryText: '배달음식',
  },
  TAXI_CHALLENGE: {
    title: '택시 금지 챌린지',
    icon: 'fas fa-taxi',
    color: '#FFC457',
    categoryText: '택시',
  },
};

// 챌린지 메타데이터 가져오기
export function getChallengeMetadata(challengeType) {
  return CHALLENGE_METADATA[challengeType] || {
    title: '챌린지',
    icon: 'fas fa-circle',
    color: '#888888',
    categoryText: '해당 카테고리',
  };
}