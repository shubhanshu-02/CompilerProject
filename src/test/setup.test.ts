import { describe, it, expect } from 'vitest';

describe('Test Setup', () => {
  it('should run basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have DOM environment', () => {
    expect(typeof document).toBe('object');
    expect(typeof window).toBe('object');
  });
});
