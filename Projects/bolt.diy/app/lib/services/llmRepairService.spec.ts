/**
 * Tests for LLM Repair Service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createLlmRepairFn, createFallbackLlmRepairFn } from './llmRepairService';

describe('llmRepairService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createLlmRepairFn', () => {
    it('creates a function that calls the LLM API with prompt', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ text: '```tsx\nconst x = 1;\n```' }),
      });
      global.fetch = mockFetch;

      const repairFn = createLlmRepairFn();
      const prompt = 'Fix this code: const x =';
      const result = await repairFn(prompt);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/llmcall',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      
      // Verify prompt was passed to API
      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.message).toBe(prompt);
      
      // Returns raw response (caller parses it)
      expect(result).toContain('const x = 1;');
    });

    it('uses custom config when provided', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ text: 'fixed code' }),
      });
      global.fetch = mockFetch;

      const repairFn = createLlmRepairFn({
        model: 'custom-model',
        provider: 'CustomProvider',
      });
      await repairFn('some prompt');

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.model).toBe('custom-model');
      expect(callBody.provider.name).toBe('CustomProvider');
    });

    it('throws on API error', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal Server Error'),
      });
      global.fetch = mockFetch;

      const repairFn = createLlmRepairFn();
      
      await expect(repairFn('some prompt')).rejects.toThrow('LLM repair failed: 500');
    });

    it('throws on empty response', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ text: '' }),
      });
      global.fetch = mockFetch;

      const repairFn = createLlmRepairFn();
      
      await expect(repairFn('some prompt')).rejects.toThrow('LLM returned empty response');
    });

    it('returns raw response for caller to parse', async () => {
      const rawResponse = 'Here is the fixed code:\n```typescript\nexport const x = 1;\n```\nDone!';
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ text: rawResponse }),
      });
      global.fetch = mockFetch;

      const repairFn = createLlmRepairFn();
      const result = await repairFn('fix this code');

      // Returns raw response - caller (autoFixLoop) will parse it
      expect(result).toBe(rawResponse);
    });
  });

  describe('createFallbackLlmRepairFn', () => {
    it('uses Groq as default fallback provider', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ text: 'fixed' }),
      });
      global.fetch = mockFetch;

      const repairFn = createFallbackLlmRepairFn();
      await repairFn('some prompt');

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.provider.name).toBe('Groq');
      expect(callBody.model).toBe('llama-3.3-70b-versatile');
    });

    it('allows custom fallback config', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ text: 'fixed' }),
      });
      global.fetch = mockFetch;

      const repairFn = createFallbackLlmRepairFn({
        model: 'other-model',
        provider: 'OtherProvider',
      });
      await repairFn('some prompt');

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.provider.name).toBe('OtherProvider');
      expect(callBody.model).toBe('other-model');
    });
  });
});
