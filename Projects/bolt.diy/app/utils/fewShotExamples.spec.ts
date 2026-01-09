import { describe, it, expect } from 'vitest';
import {
  FEW_SHOT_EXAMPLES,
  getFewShotExamples,
  getFewShotByCategory,
  formatFewShotExamples,
} from './fewShotExamples';
import type { ViolationCode } from '~/lib/services/sectionContracts';

describe('fewShotExamples', () => {
  describe('FEW_SHOT_EXAMPLES registry', () => {
    it('should have examples for SYNTAX codes', () => {
      const syntaxExamples = FEW_SHOT_EXAMPLES.filter(ex => 
        ex.violationCode.startsWith('SYNTAX_')
      );
      expect(syntaxExamples.length).toBeGreaterThan(0);
    });

    it('should have examples for CONTRACT codes', () => {
      const contractExamples = FEW_SHOT_EXAMPLES.filter(ex => 
        ex.violationCode.startsWith('CONTRACT_')
      );
      expect(contractExamples.length).toBeGreaterThan(0);
    });

    it('each example should have required fields', () => {
      for (const ex of FEW_SHOT_EXAMPLES) {
        expect(ex.violationCode).toBeTruthy();
        expect(ex.description).toBeTruthy();
        expect(ex.broken).toBeTruthy();
        expect(ex.fixed).toBeTruthy();
        expect(ex.broken).not.toBe(ex.fixed);
      }
    });
  });

  describe('getFewShotExamples', () => {
    it('should return matching examples for given codes', () => {
      const codes: ViolationCode[] = ['SYNTAX_JSX_UNCLOSED', 'SYNTAX_BRACE_EXPECTED'];
      const result = getFewShotExamples(codes);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(ex => 
        ex.violationCode === 'SYNTAX_JSX_UNCLOSED' || 
        ex.violationCode === 'SYNTAX_BRACE_EXPECTED'
      )).toBe(true);
    });

    it('should return empty array for non-matching codes', () => {
      const codes: ViolationCode[] = ['CONTRACT_PAGE_MISSING_SECTION'];
      const result = getFewShotExamples(codes);
      expect(result).toEqual([]);
    });

    it('should respect maxExamples limit', () => {
      const allSyntax = FEW_SHOT_EXAMPLES
        .filter(ex => ex.violationCode.startsWith('SYNTAX_'))
        .map(ex => ex.violationCode);
      
      const result = getFewShotExamples(allSyntax, 2);
      expect(result.length).toBeLessThanOrEqual(2);
    });

    it('should return only examples matching input codes (Property 3: Few-Shot Relevance)', () => {
      const inputCodes: ViolationCode[] = ['SYNTAX_JSX_UNCLOSED', 'CONTRACT_HERO_MISSING_H1'];
      const result = getFewShotExamples(inputCodes, 10);
      
      for (const ex of result) {
        expect(inputCodes).toContain(ex.violationCode);
      }
    });
  });

  describe('getFewShotByCategory', () => {
    it('should return SYNTAX examples', () => {
      const result = getFewShotByCategory('SYNTAX', 5);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(ex => ex.violationCode.startsWith('SYNTAX_'))).toBe(true);
    });

    it('should return CONTRACT examples', () => {
      const result = getFewShotByCategory('CONTRACT', 5);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(ex => ex.violationCode.startsWith('CONTRACT_'))).toBe(true);
    });

    it('should respect maxExamples limit', () => {
      const result = getFewShotByCategory('SYNTAX', 2);
      expect(result.length).toBeLessThanOrEqual(2);
    });
  });

  describe('formatFewShotExamples', () => {
    it('should return empty string for empty array', () => {
      const result = formatFewShotExamples([]);
      expect(result).toBe('');
    });

    it('should format examples with BROKEN and FIXED sections', () => {
      const examples = getFewShotExamples(['SYNTAX_JSX_UNCLOSED'], 1);
      const result = formatFewShotExamples(examples);
      
      expect(result).toContain('SIMILAR FIXES');
      expect(result).toContain('BROKEN:');
      expect(result).toContain('FIXED:');
      expect(result).toContain('SYNTAX_JSX_UNCLOSED');
    });

    it('should include violation code and description', () => {
      const examples = getFewShotExamples(['CONTRACT_HERO_MISSING_H1'], 1);
      const result = formatFewShotExamples(examples);
      
      expect(result).toContain('CONTRACT_HERO_MISSING_H1');
      expect(result).toContain('Hero section missing h1 heading');
    });

    it('should number multiple examples', () => {
      const codes: ViolationCode[] = ['SYNTAX_JSX_UNCLOSED', 'SYNTAX_BRACE_EXPECTED'];
      const examples = getFewShotExamples(codes, 2);
      const result = formatFewShotExamples(examples);
      
      expect(result).toContain('Example 1');
      if (examples.length > 1) {
        expect(result).toContain('Example 2');
      }
    });
  });
});
