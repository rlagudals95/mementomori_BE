import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SocialLoginUserInfo } from './social-login.interface';

// ref: https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token
export interface KakaoOAuthTokenRequest {
  redirect_uri: string;
  kakao_client_id: string;
  code: string;
}

export interface KakaoOAuthTokenResponse {
  token_type: string;
  access_token: string;
  expires_in: number;
  id_token?: string;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope?: string;
}

export interface KakaoAcount {
  has_email: boolean;
  email_needs_agreement: boolean;
  is_email_valid: boolean;
  is_email_verified: boolean;
  email: string;
  has_age_range: boolean;
  age_range_needs_agreement: boolean;
  age_range: string;
  has_gender: boolean;
  gender_needs_agreement: boolean;
  gender: string;
  phone: string;
  name: string;
}

export interface KakaoUserInfoResponse {
  id: number;
  kakao_account: KakaoAcount;
  access_token?: string;
}

@Injectable()
export class KakaoService {
  constructor(private configService: ConfigService) {}

  async login(code: string): Promise<SocialLoginUserInfo> {
    const redirect_uri = this.configService.get('KAKAO_REDIRECT_URI');
    const kakao_client_id = this.configService.get('KAKAO_REST_API_KEY');
    const oAuthToken = await this.getOAuthToken({
      redirect_uri,
      kakao_client_id,
      code,
    });

    const userInfo = await this.getUserInfo(oAuthToken.access_token);

    return {
      id: userInfo.id.toString(),
      phone: userInfo.kakao_account.phone,
      email: userInfo.kakao_account.email,
      ageRange: userInfo.kakao_account.age_range,
      name: userInfo.kakao_account.name,
      gender: userInfo.kakao_account.gender,
    };
  }

  async getOAuthToken(
    request: KakaoOAuthTokenRequest,
  ): Promise<KakaoOAuthTokenResponse> {
    const queryObj = {
      grant_type: 'authorization_code',
      client_id: request.kakao_client_id,
      redirect_url: request.redirect_uri,
      code: request.code,
    };

    const queryString = Object.entries(queryObj)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    try {
      const response = await axios.post(
        `https://kauth.kakao.com/oauth/token?${queryString}`,
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );
      return response.data as KakaoOAuthTokenResponse;
    } catch (error) {
      throw error;
    }
  }

  async getUserInfo(accessToken: string): Promise<KakaoUserInfoResponse> {
    try {
      return (
        await axios.get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data as KakaoUserInfoResponse;
    } catch (error) {
      throw error;
    }
  }
}
