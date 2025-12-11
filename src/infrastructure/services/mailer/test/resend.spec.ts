import { describe, it, expect, beforeEach } from 'vitest';
import { ResendService } from '../resend.service.ts';

describe('ResendService', () => {
  let resendService: ResendService;

  beforeEach(() => {
    // Mock da variável de ambiente
    process.env.RESEND_API_KEY = 're_test_api_key';
    resendService = new ResendService();
  });

  it('should create a ResendService instance', () => {
    expect(resendService).toBeInstanceOf(ResendService);
  });

  it('should throw error if RESEND_API_KEY is not set', () => {
    delete process.env.RESEND_API_KEY;
    expect(() => new ResendService()).toThrow('RESEND_API_KEY environment variable is required');
  });

  it('should have a send method', () => {
    expect(resendService.send).toBeDefined();
    expect(typeof resendService.send).toBe('function');
  });

  it('should have a testConnection method', () => {
    expect(resendService.testConnection).toBeDefined();
    expect(typeof resendService.testConnection).toBe('function');
  });
});
