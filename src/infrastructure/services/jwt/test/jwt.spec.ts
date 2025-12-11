import { describe, it, expect, beforeEach, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { JwtService } from '../jwt.service.ts';
import type { JwtPayload } from '../jwt.repository.ts';

// Mock jsonwebtoken
vi.mock('jsonwebtoken');
vi.mock('@/infrastructure/config/env.ts', () => ({
  env: {
    JWT_SECRET: 'test-secret-key-123',
    JWT_EXPIRES_IN: '1h',
  },
}));

describe('JwtService', () => {
  let service: JwtService;
  let mockSign: ReturnType<typeof vi.fn>;
  let mockVerify: ReturnType<typeof vi.fn>;
  let mockDecode: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSign = vi.fn();
    mockVerify = vi.fn();
    mockDecode = vi.fn();

    vi.mocked(jwt.sign).mockImplementation(mockSign);
    vi.mocked(jwt.verify).mockImplementation(mockVerify);
    vi.mocked(jwt.decode).mockImplementation(mockDecode);

    service = new JwtService();
  });

  describe('Constructor', () => {
    it('should create a JwtService instance', () => {
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(JwtService);
    });
  });

  describe('generate()', () => {
    it('should generate a JWT token successfully', async () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';
      mockSign.mockReturnValue(mockToken);

      const payload: JwtPayload = {
        id: 'user-123',
        email: 'test@example.com',
        individualAccountId: 'account-456',
        isMissingOnboarding: false,
      };

      const result = await service.generate(payload);

      expect(result).toBeDefined();
      expect(result.token).toBe(mockToken);
      expect(result.expiresIn).toBe('1h');
      expect(mockSign).toHaveBeenCalledWith(
        payload,
        'test-secret-key-123',
        {
          expiresIn: '1h',
        }
      );
    });

    it('should generate token with custom expiration', async () => {
      const mockToken = 'custom-expiry-token-123';
      mockSign.mockReturnValue(mockToken);

      const payload: JwtPayload = {
        id: 'user-789',
        email: 'test@example.com',
      };

      const customExpiry = '30d';
      const result = await service.generate(payload, customExpiry);

      expect(result.token).toBe(mockToken);
      expect(result.expiresIn).toBe(customExpiry);
      expect(mockSign).toHaveBeenCalledWith(
        payload,
        'test-secret-key-123',
        {
          expiresIn: customExpiry,
        }
      );
    });

    it('should generate token for corporate account', async () => {
      const mockToken = 'corporate-token-123';
      mockSign.mockReturnValue(mockToken);

      const payload: JwtPayload = {
        id: 'user-789',
        email: 'corporate@example.com',
        corporateAccountId: 'corp-456',
        isMissingOnboarding: true,
      };

      const result = await service.generate(payload);

      expect(result.token).toBe(mockToken);
      expect(mockSign).toHaveBeenCalledWith(
        payload,
        'test-secret-key-123',
        expect.objectContaining({
          expiresIn: '1h',
        })
      );
    });

    it('should throw error when token generation fails', async () => {
      mockSign.mockImplementation(() => {
        throw new Error('Token generation failed');
      });

      const payload: JwtPayload = {
        id: 'user-123',
        email: 'test@example.com',
      };

      await expect(service.generate(payload)).rejects.toThrow('Failed to generate token');
    });
  });

  describe('verify()', () => {
    it('should verify a valid JWT token successfully', async () => {
      const mockPayload: JwtPayload = {
        id: 'user-123',
        email: 'test@example.com',
        individualAccountId: 'account-456',
      };
      mockVerify.mockReturnValue(mockPayload);

      const token = 'valid-token-123';
      const result = await service.verify(token);

      expect(result.isValid).toBe(true);
      expect(result.payload).toEqual(mockPayload);
      expect(result.error).toBeUndefined();
      expect(mockVerify).toHaveBeenCalledWith(
        token,
        'test-secret-key-123'
      );
    });

    it('should return error for expired token', async () => {
      const expiredError = new jwt.TokenExpiredError('Token expired', new Date());
      mockVerify.mockImplementation(() => {
        throw expiredError;
      });

      const token = 'expired-token-123';
      const result = await service.verify(token);

      expect(result.isValid).toBe(false);
      expect(result.payload).toBeUndefined();
      expect(result.error).toBe('Token has expired');
    });

    it('should return error for invalid token format', async () => {
      const invalidError = new jwt.JsonWebTokenError('Invalid token');
      mockVerify.mockImplementation(() => {
        throw invalidError;
      });

      const token = 'invalid-token-123';
      const result = await service.verify(token);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid token format');
    });

    it('should return error for token not active yet', async () => {
      const notBeforeError = new jwt.NotBeforeError('Token not active', new Date());
      mockVerify.mockImplementation(() => {
        throw notBeforeError;
      });

      const token = 'not-active-token-123';
      const result = await service.verify(token);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Token not active yet');
    });

    it('should return generic error for unknown verification errors', async () => {
      mockVerify.mockImplementation(() => {
        throw new Error('Unknown error');
      });

      const token = 'unknown-error-token';
      const result = await service.verify(token);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid token');
    });
  });

  describe('decode()', () => {
    it('should decode a JWT token without verification', () => {
      const mockPayload: JwtPayload = {
        id: 'user-123',
        email: 'test@example.com',
        corporateAccountId: 'corp-789',
      };
      mockDecode.mockReturnValue(mockPayload);

      const token = 'token-to-decode-123';
      const result = service.decode(token);

      expect(result).toEqual(mockPayload);
      expect(mockDecode).toHaveBeenCalledWith(token);
    });

    it('should return null when decoding fails', () => {
      mockDecode.mockImplementation(() => {
        throw new Error('Decode failed');
      });

      const token = 'invalid-decode-token';
      const result = service.decode(token);

      expect(result).toBeNull();
    });

    it('should return null when token is malformed', () => {
      mockDecode.mockReturnValue(null);

      const token = 'malformed-token';
      const result = service.decode(token);

      expect(result).toBeNull();
    });
  });

  describe('Interface compliance JwtTokenService', () => {
    it('should correctly implement JwtTokenService interface', () => {
      expect(typeof service.generate).toBe('function');
      expect(typeof service.verify).toBe('function');
      expect(typeof service.decode).toBe('function');
      expect(service).toHaveProperty('generate');
      expect(service).toHaveProperty('verify');
      expect(service).toHaveProperty('decode');
    });

    it('should return TokenResponse with correct structure', async () => {
      const mockToken = 'test-token-123';
      mockSign.mockReturnValue(mockToken);

      const payload: JwtPayload = {
        id: 'user-123',
        email: 'test@example.com',
      };

      const result = await service.generate(payload);

      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.expiresIn).toBeDefined();
      expect(typeof result.token).toBe('string');
      expect(typeof result.expiresIn).toBe('string');
    });

    it('should return VerifyTokenResponse with correct structure', async () => {
      const mockPayload: JwtPayload = {
        id: 'user-123',
        email: 'test@example.com',
      };
      mockVerify.mockReturnValue(mockPayload);

      const result = await service.verify('valid-token');

      expect(result).toBeDefined();
      expect(typeof result.isValid).toBe('boolean');
      expect(result.payload).toBeDefined();
    });
  });
});