import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SocialLoginUserInfo } from './social-login.interface';

// ref: https://developers.naver.com/docs/login/devguide/devguide.md#3-4-4-%EC%A0%91%EA%B7%BC-%ED%86%A0%ED%81%B0-%EB%B0%9C%EA%B8%89-%EC%9A%94%EC%B2%AD
export interface NaverOAuthTokenRequest {
  naver_client_id: string;
  client_secret: string;
  code: string;
}

export interface NaverOAuthTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  error: string;
  error_description: string;
}

export interface NaverUserInfoResponse {
  id: string;
  nickname: string;
  profile_image: string;
  age: string;
  gender: string;
  email: string;
  mobile: string;
  mobile_e164: string;
  name: string;
  birthday: string;
  birthyear: string;
}

@Injectable()
export class NaverService {
  constructor(private configService: ConfigService) {}

  async mapTo(userInfo: NaverUserInfoResponse): Promise<SocialLoginUserInfo> {
    const gender = userInfo.gender
      ? userInfo.gender === 'M'
        ? 'male'
        : 'famale'
      : undefined;
    return {
      id: userInfo.id,
      phone: userInfo.mobile,
      email: userInfo.email,
      ageRange: userInfo.age,
      name: userInfo.name,
      gender,
    };
  }

  async login(code: string): Promise<SocialLoginUserInfo> {
    const naver_client_id = this.configService.get('NAVER_CLIENT_ID');
    const client_secret = this.configService.get('NAVER_SECRET');
    const oAuthToken = await this.getOAuthToken({
      naver_client_id,
      client_secret,
      code,
    });

    const userInfo = await this.getUserInfo(oAuthToken.access_token);
    return this.mapTo(userInfo);
  }

  async getOAuthToken(
    payload: NaverOAuthTokenRequest,
  ): Promise<NaverOAuthTokenResponse> {
    const queryObj = {
      grant_type: 'authorization_code',
      client_id: payload.naver_client_id,
      client_secret: payload.client_secret,
      code: payload.code,
    };
    const queryString = Object.entries(queryObj)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    try {
      const response = await axios.post(
        `https://nid.naver.com/oauth2.0/token?${queryString}`,
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        },
      );
      return response.data as NaverOAuthTokenResponse;
    } catch (error) {
      throw error;
    }
  }

  public async getUserInfo(
    accessToken: string,
  ): Promise<NaverUserInfoResponse> {
    try {
      return (
        await axios.get('https://openapi.naver.com/v1/nid/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      ).data.response as NaverUserInfoResponse;
    } catch (error) {
      throw error;
    }
  }
}
