import { describe, expect, it } from 'vitest';
import { recordCount } from '@/lib/labels';

describe('recordCount', () => {
  it.each([
    [1, '1 registro'],
    [9, '9 registros'],
  ])('counts %i as %j', (total, label) => {
    expect(recordCount(total)).toBe(label);
  });
});
