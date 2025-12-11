import jwt, { type SignOptions } from 'jsonwebtoken';
import type { JwtTokenService, JwtPayload, TokenResponse, VerifyTokenResponse } from './jwt.repository.ts';
import { env } from '@/infrastructure/config/env.ts';
import { BadRequestError } from '@/infrastructure/config/errors.ts';

export class JwtService implements JwtTokenService {
  private secretKey: string;
  private noAccessSecretKey: string;

  constructor() {
    const secret = env.JWT_SECRET;
    const noAccessSecret = env.JWT_SECRET_NOACCESS;

    if (!secret) {
      throw new BadRequestError('JWT_SECRET environment variable is required');
    }

    if (!noAccessSecret) {
      throw new BadRequestError('JWT_SECRET_NOACCESS environment variable is required');
    }

    this.secretKey = secret;
    this.noAccessSecretKey = noAccessSecret;
  }

  async generate(payload: JwtPayload, expiresIn?: string, useNoAccessSecret = false): Promise<TokenResponse> {
    try {
      const expiry = expiresIn || env.JWT_EXPIRES_IN;
      const secret = useNoAccessSecret ? this.noAccessSecretKey : this.secretKey;
      
      const token = jwt.sign(payload, secret, {
        expiresIn: expiry as any,
      });

      return {
        token,
        expiresIn: expiry,
      };
    } catch (error) {
      throw new BadRequestError('Failed to generate token');
    }
  }

  async verify(token: string, useNoAccessSecret = false): Promise<VerifyTokenResponse> {
    try {
      const secret = useNoAccessSecret ? this.noAccessSecretKey : this.secretKey;
      const decoded = jwt.verify(token, secret) as JwtPayload;

      return {
        isValid: true,
        payload: decoded,
      };
    } catch (error) {
      let errorMessage = 'Invalid token';
      
      return {
        isValid: false,
        error: errorMessage,
      };
    }
  }

  decode(token: string): JwtPayload | null {
    try {
      const decoded = jwt.decode(token) as JwtPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}