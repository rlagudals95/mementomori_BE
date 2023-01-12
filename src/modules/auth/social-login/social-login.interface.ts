export enum LoginMethod {
  KAKAO = 'kakao',
  NAVER = 'naver',
  APPLE = 'apple',
}

export interface SocialLoginUserInfo {
  id: string;
  phone?: string;
  email?: string;
  name?: string;
  ageRange?: string;
  gender?: string;
}
