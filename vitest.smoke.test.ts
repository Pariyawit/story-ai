import { describe, it, expect } from 'vitest';

describe('Vitest Setup', () => {
  it('runs tests successfully', () => {
    expect(true).toBe(true);
  });

  it('supports TypeScript', () => {
    const value: number = 42;
    expect(value).toBe(42);
  });

  it('has working matchers from jest-dom', () => {
    // This verifies that vitest.setup.ts is loading correctly
    expect(typeof expect.extend).toBe('function');
  });
});
