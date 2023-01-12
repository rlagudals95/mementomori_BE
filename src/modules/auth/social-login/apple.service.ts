import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as qs from 'querystring';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { SocialLoginUserInfo } from './social-login.interface';
import { InvalidArgumentError } from '@modules/common/common.exception';

// ref: https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens
export interface AppleOAuthTokenRequest {
  redirect_uri: string;
  client_id: string;
  client_secret: string;
  code: string;
}

interface AppleOAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
  id_token: string;
}

interface IdTokenPayload {
  iss?: string;
  sub?: string;
  aud?: string;
  iat?: number;
  exp?: number;
  nonce?: string;
  nonce_supported?: boolean;
  email?: string;
  email_verified?: boolean;
  is_private_email?: boolean;
  real_user_status?: number;
  transfer_sub?: string;
}

interface AppleUser {
  name: {
    firstName: string;
    lastName: string;
  };
  email: string;
}

export interface CallbackAuthResponse {
  state: string;
  code: string;
  id_token: string;
  user: string;
}

@Injectable()
export class AppleService {
  constructor(private configService: ConfigService) {}

  async login(code: string): Promise<SocialLoginUserInfo> {
    const client_secret = this.createClientSecret();
    const client_id = this.configService.get('APPLE_SERVICE_ID');
    const redirect_uri = this.configService.get('APPLE_REDIRECT_URI');
    const oAuthToken = await this.getOAuthToken({
      code,
      client_secret,
      client_id,
      redirect_uri,
    });

    // TODO: validate id_token
    const idToken = jwt.decode(oAuthToken.id_token) as IdTokenPayload;

    return {
      id: idToken.sub,
      email: idToken.email,
    };
  }

  async mapCallbackPayload(payload: any): Promise<SocialLoginUserInfo> {
    try {
      // TODO: validate id_token
      const callbackResponse = payload as CallbackAuthResponse;
      const name = Array.from(callbackResponse.user || [])
        .map((u) => JSON.parse(u) as AppleUser)
        .map((u) => `${u.name.lastName} ${u.name.firstName}`)
        .shift();
      const idToken = jwt.decode(callbackResponse.id_token) as IdTokenPayload;
      return {
        id: idToken.sub,
        email: idToken.email,
        name,
      };
    } catch (error) {
      throw new InvalidArgumentError(error);
    }
  }

  async getOAuthToken(
    request: AppleOAuthTokenRequest,
  ): Promise<AppleOAuthTokenResponse> {
    try {
      return (
        await axios.post(
          'https://appleid.apple.com/auth/token',
          qs.stringify({
            grant_type: 'authorization_code',
            code: request.code,
            client_secret: request.client_secret,
            client_id: request.client_id,
            redirect_uri: request.redirect_uri,
          }),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
      ).data as AppleOAuthTokenResponse;
    } catch (error) {
      throw error;
    }
  }

  private createClientSecret(): string {
    return jwt.sign({}, this.configService.get('APPLE_PRIVATE_KEY_STRING'), {
      algorithm: 'ES256',
      expiresIn: '1h',
      audience: 'https://appleid.apple.com',
      issuer: this.configService.get('APPLE_TEAM_ID'), // TEAM_ID
      subject: this.configService.get('APPLE_SERVICE_ID'), // Service ID
      keyid: this.configService.get('APPLE_KEY_ID'), // KEY_ID
    });
  }
}
