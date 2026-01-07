import { describe, it, expect } from 'vitest';

import { parseUrlParams } from '../urlParams';

describe('urlParams', () => {
  describe('parseUrlParams()', () => {
    it('returns empty object for empty params', () => {
      const params = new URLSearchParams('');
      expect(parseUrlParams(params)).toEqual({});
    });

    it('parses valid name param', () => {
      const params = new URLSearchParams('?name=Alex');
      expect(parseUrlParams(params)).toEqual({ name: 'Alex' });
    });

    it('sanitizes name - removes HTML tags', () => {
      const params = new URLSearchParams('?name=<script>alert("xss")</script>Alex');
      expect(parseUrlParams(params)).toEqual({ name: 'alert("xss")Alex' });
    });

    it('limits name to 50 characters', () => {
      const longName = 'A'.repeat(100);
      const params = new URLSearchParams(`?name=${longName}`);
      expect(parseUrlParams(params).name).toHaveLength(50);
    });

    it('trims whitespace from name', () => {
      const params = new URLSearchParams('?name=  Alex  ');
      expect(parseUrlParams(params)).toEqual({ name: 'Alex' });
    });

    it('ignores empty name after sanitization', () => {
      const params = new URLSearchParams('?name=   ');
      expect(parseUrlParams(params)).toEqual({});
    });

    it('parses valid gender param - boy', () => {
      const params = new URLSearchParams('?gender=boy');
      expect(parseUrlParams(params)).toEqual({ gender: 'boy' });
    });

    it('parses valid gender param - girl', () => {
      const params = new URLSearchParams('?gender=girl');
      expect(parseUrlParams(params)).toEqual({ gender: 'girl' });
    });

    it('ignores invalid gender param', () => {
      const params = new URLSearchParams('?gender=cat');
      expect(parseUrlParams(params)).toEqual({});
    });

    it('parses valid language param - en', () => {
      const params = new URLSearchParams('?language=en');
      expect(parseUrlParams(params)).toEqual({ language: 'en' });
    });

    it('parses valid language param - th', () => {
      const params = new URLSearchParams('?language=th');
      expect(parseUrlParams(params)).toEqual({ language: 'th' });
    });

    it('parses valid language param - singlish', () => {
      const params = new URLSearchParams('?language=singlish');
      expect(parseUrlParams(params)).toEqual({ language: 'singlish' });
    });

    it('ignores invalid language param', () => {
      const params = new URLSearchParams('?language=french');
      expect(parseUrlParams(params)).toEqual({});
    });

    it('parses valid theme param', () => {
      const params = new URLSearchParams('?theme=space_adventure');
      expect(parseUrlParams(params)).toEqual({ theme: 'space_adventure' });
    });

    it('parses all valid themes', () => {
      const themes = [
        'enchanted_forest',
        'space_adventure',
        'underwater_kingdom',
        'dinosaur_land',
        'fairy_tale_castle',
      ];
      themes.forEach((theme) => {
        const params = new URLSearchParams(`?theme=${theme}`);
        expect(parseUrlParams(params)).toEqual({ theme });
      });
    });

    it('ignores invalid theme param', () => {
      const params = new URLSearchParams('?theme=zombie_land');
      expect(parseUrlParams(params)).toEqual({});
    });

    it('parses multiple valid params', () => {
      const params = new URLSearchParams('?name=Alex&gender=girl&language=singlish&theme=space_adventure');
      expect(parseUrlParams(params)).toEqual({
        name: 'Alex',
        gender: 'girl',
        language: 'singlish',
        theme: 'space_adventure',
      });
    });

    it('handles mixed valid and invalid params', () => {
      const params = new URLSearchParams('?name=Alex&gender=invalid&language=th');
      expect(parseUrlParams(params)).toEqual({
        name: 'Alex',
        language: 'th',
      });
    });

    it('handles URL encoded names with spaces', () => {
      const params = new URLSearchParams('?name=Alex%20Smith');
      expect(parseUrlParams(params)).toEqual({ name: 'Alex Smith' });
    });

    it('handles special characters in names', () => {
      const params = new URLSearchParams("?name=O'Brien");
      expect(parseUrlParams(params)).toEqual({ name: "O'Brien" });
    });
  });
});
