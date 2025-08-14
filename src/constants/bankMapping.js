// 은행 로고 매핑 테이블
export const BANK_LOGO_MAP = {
  // 실제 API 응답 기준으로 매핑
  '국민은행': 'kb',
  '아이엠뱅크': 'daegu',  // 아이엠뱅크(대구은행)
  '제주은행': 'shinhan', // 제주은행은 신한금융그룹 계열
  '부산은행': 'bukyong',
  '한국씨티은행': 'citi',
  '씨티은행': 'citi',
  '대구은행': 'daegu', 
  '하나은행': 'hana',
  '주식회사 하나은행' : 'hana',
  '중소기업은행': 'ibk',
  'IBK기업은행': 'ibk',
  '전북은행': 'jeonbuk',
  '케이뱅크': 'kbank',
  '한국산업은행': 'kdb',
  '산업은행': 'kdb',
  '새마을금고': 'mg',
  '농협은행': 'nh',
  'NH농협은행': 'nh',
  '우체국예금보험': 'post',
  '우체국': 'post',
  'SC제일은행': 'sc',
  '한국스탠다드차타드은행': 'sc',
  '주식회사 케이뱅크': 'kbank',
  '주식회사 카카오뱅크': 'kakao',  // kakao.svg
  '토스뱅크 주식회사': 'toss',     // toss.svg
  '신한은행': 'shinhan',
  '수협은행': 'suhyup',
  '우리은행': 'woori',
  '경남은행': 'bukyong'
};

// 은행 URL 매핑 테이블
export const BANK_URL_MAP = {
  // 실제 API 응답 기준으로 매핑
  '국민은행': 'https://obank.kbstar.com/quics?page=C016613#CP',
  '아이엠뱅크': 'https://www.imbank.co.kr/com_ebz_fnp_sub_main.jsp',  // 아이엠뱅크(대구은행)
  '제주은행': 'https://www.jejubank.co.kr/hmpg/prdGdnc/sid/mndp.do',
  '부산은행': 'https://www.busanbank.co.kr/ib20/mnu/FPMDPO012002001',
  '한국씨티은행': 'https://www.citibank.co.kr/prod/saving/index.html',
  '씨티은행': 'https://www.citibank.co.kr/prod/saving/index.html',
  '대구은행': 'https://www.imbank.co.kr/com_ebz_fnp_sub_main.jsp',
  '하나은행': 'https://www.kebhana.com/cont/mall/mall08/mall0805/index.jsp?_menuNo=62608',
  '중소기업은행': 'https://mybank.ibk.co.kr/uib/jsp/index.jsp',
  'IBK기업은행': 'https://mybank.ibk.co.kr/uib/jsp/index.jsp',
  '전북은행': 'https://www.jbbank.co.kr/',
  '케이뱅크': 'https://www.kbanknow.com/ib20/mnu/FPMDPT080000#n',
  '한국산업은행': 'https://banking.kdb.co.kr/bp/index.jsp',
  '산업은행': 'https://banking.kdb.co.kr/bp/index.jsp',
  '새마을금고': 'https://www.kfcc.co.kr/financialProduct/financialMain.do',
  '농협은행': 'https://smartmarket.nonghyup.com/servlet/BFDCW1013R.view',
  'NH농협은행': 'https://smartmarket.nonghyup.com/servlet/BFDCW1013R.view',
  '우체국예금보험': 'https://mall.epostbank.go.kr/IPDMDM0000.do',
  '우체국': 'https://mall.epostbank.go.kr/IPDMDM0000.do',
  'SC제일은행': 'https://www.standardchartered.co.kr/np/kr/pl/se/SavingList.jsp?ptfrm=HIN.KOR.INTRO.mega.korPerA1_1',
  '한국스탠다드차타드은행': 'https://www.standardchartered.co.kr/np/kr/pl/se/SavingList.jsp?ptfrm=HIN.KOR.INTRO.mega.korPerA1_1',
  '주식회사 하나은행': 'https://www.kebhana.com/cont/mall/mall08/mall0805/index.jsp?_menuNo=62608',
  '주식회사 케이뱅크': 'https://www.kbanknow.com/ib20/mnu/FPMDPT080000#n',
  '주식회사 카카오뱅크': 'https://www.kakaobank.com/products/savings',
  '토스뱅크 주식회사': 'https://tossbank.com/product-service/savings/savings-growth',
  '신한은행': 'https://bank.shinhan.com/index.jsp#020105030000',
  '수협은행': 'https://www.suhyup-bank.com/',
  '우리은행': 'https://spot.wooribank.com/pot/Dream?withyou=PODEP0021',
  '경남은행': 'https://www.knbank.co.kr/ib20/mnu/FPMDPT020000000'
};

// 사용자에게 표시할 은행명 매핑 (정식명칭 → 브랜드명)
export const BANK_DISPLAY_NAME_MAP = {
  '한국산업은행': 'KDB산업은행',
  '주식회사 하나은행': '하나은행',
  '중소기업은행': 'IBK기업은행',
  '한국스탠다드차타드은행': 'SC제일은행',
  '주식회사 케이뱅크': '케이뱅크',
  '주식회사 카카오뱅크': '카카오뱅크',
  '토스뱅크 주식회사': '토스뱅크',
};

// 기본값 설정
export const DEFAULT_BANK = '국민은행';