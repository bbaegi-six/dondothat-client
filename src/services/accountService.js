// services/accountService.js
import { accountAPI } from '@/utils/api';

export const accountService = {
  // 메인 계좌 연결
  async connectMainAccount(accountData) {
    try {
      // 백엔드 AssetDTO 형식에 맞게 데이터 변환
      const data = {
        bankName: accountData.bankName, // 은행명
        bankId: accountData.bankId, // 온라인뱅킹 아이디
        bankpw: accountData.bankpw, // 온라인뱅킹 비밀번호
        bankAccount: accountData.bankAccount, // 계좌번호
      };

      const response = await accountAPI.connectMain(data);

      return response;
    } catch (error) {
      console.error('메인 계좌 연결 실패:', error);
      throw new Error(`메인 계좌 연결 실패: ${this.getErrorMessage(error)}`);
    }
  },

  // 서브 계좌 연결
  async connectSubAccount(accountData) {
    try {
      const data = {
        bankName: accountData.bankName,
        bankId: accountData.bankId,
        bankpw: accountData.bankpw,
        bankAccount: accountData.bankAccount,
      };

      const response = await accountAPI.connectSub(data);

      return response;
    } catch (error) {
      console.error('서브 계좌 연결 실패:', error);
      throw new Error(`서브 계좌 연결 실패: ${this.getErrorMessage(error)}`);
    }
  },

  // 계좌 삭제
  async deleteAccount(status) {
    try {
      // status 파라미터 필수 검증
      if (!status) {
        throw new Error('삭제할 계좌 타입을 지정해주세요. (main 또는 sub)');
      }

      // 유효한 status 값 검증
      if (status !== 'main' && status !== 'sub') {
        throw new Error('계좌 타입은 main 또는 sub만 가능합니다.');
      }

      const response = await accountAPI.delete(status);

      return response;
    } catch (error) {
      console.error('계좌 삭제 실패:', error);
      throw new Error(`계좌 삭제 실패: ${this.getErrorMessage(error)}`);
    }
  },
  // assetConnected 상태 업데이트
  async updateAssetConnected(assetConnected = true) {
    try {
      const response = await accountAPI.updateConnected(assetConnected);
      return response;
    } catch (error) {
      console.log('connected update 요청 실패', error);
    }
  },
};
export default accountService;
