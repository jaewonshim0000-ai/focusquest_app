import { describe, it, expect } from 'vitest';
import { calculateFocusPoints, formatTimer, formatDuration } from '../src/app/utils/constants';

describe('calculateFocusPoints', () => {
  it('calculates base points for 10-minute session', () => {
    expect(calculateFocusPoints(10, 0)).toBe(10);
  });

  it('calculates base points for 30-minute session', () => {
    expect(calculateFocusPoints(30, 0)).toBe(40);
  });

  it('calculates base points for 60-minute session', () => {
    expect(calculateFocusPoints(60, 0)).toBe(100);
  });

  it('adds streak bonus correctly', () => {
    expect(calculateFocusPoints(30, 3)).toBe(40 + 6 * 3); // 58
  });

  it('caps streak bonus at 7 days', () => {
    expect(calculateFocusPoints(30, 10)).toBe(40 + 6 * 7); // 82
    expect(calculateFocusPoints(30, 7)).toBe(40 + 6 * 7); // 82
  });

  it('returns 0 for invalid durations', () => {
    expect(calculateFocusPoints(5, 0)).toBe(0);
    expect(calculateFocusPoints(150, 0)).toBe(0);
  });

  it('handles 90-120 minute tier', () => {
    expect(calculateFocusPoints(90, 0)).toBe(150);
    expect(calculateFocusPoints(120, 0)).toBe(150);
  });

  it('handles 15-minute tier correctly', () => {
    expect(calculateFocusPoints(15, 0)).toBe(20);
    expect(calculateFocusPoints(29, 0)).toBe(20);
  });
});

describe('formatTimer', () => {
  it('formats seconds as MM:SS', () => {
    expect(formatTimer(0)).toBe('00:00');
    expect(formatTimer(65)).toBe('01:05');
    expect(formatTimer(3600)).toBe('60:00');
    expect(formatTimer(5999)).toBe('99:59');
  });
});

describe('formatDuration', () => {
  it('formats seconds as human-readable', () => {
    expect(formatDuration(0)).toBe('0m 0s');
    expect(formatDuration(65)).toBe('1m 5s');
    expect(formatDuration(3661)).toBe('1h 1m 1s');
  });
});
