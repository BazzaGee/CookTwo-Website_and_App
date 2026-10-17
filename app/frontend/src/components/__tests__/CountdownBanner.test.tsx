import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, act } from '@testing-library/react';
import CountdownBanner from '../CountdownBanner';

const unit = (container: HTMLElement, key: string) =>
  container.querySelector(`[data-unit="${key}"]`) as HTMLElement;

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('CountdownBanner', () => {
  it('renders the four countdown units and the target date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2026, 9, 13, 0, 0, 0)));

    const { container } = render(<CountdownBanner />);

    expect(screen.getByRole('timer')).toBeInTheDocument();
    expect(screen.getByText('Premium goes live 1 November 2026')).toBeInTheDocument();

    // 2026-10-13T00:00Z -> 2026-11-01T00:00Z is exactly 19 days
    expect(unit(container, 'days').textContent).toBe('19');
    expect(unit(container, 'hours').textContent).toBe('00');
    expect(unit(container, 'minutes').textContent).toBe('00');
    expect(unit(container, 'seconds').textContent).toBe('00');
  });

  it('ticks the seconds unit on an interval', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2026, 9, 13, 0, 0, 0)));

    const { container } = render(<CountdownBanner />);

    expect(unit(container, 'seconds').textContent).toBe('00');

    // advancing fake timers also advances the clock, so the interval sees +1s
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(unit(container, 'seconds').textContent).toBe('59');
  });

  it('rolls seconds down through a minute boundary', () => {
    vi.useFakeTimers();
    // 2026-10-31T23:58:45Z is 75s before the target: 0d 0h 1m 15s
    vi.setSystemTime(new Date(Date.UTC(2026, 9, 31, 23, 58, 45)));

    const { container } = render(<CountdownBanner />);

    expect(unit(container, 'minutes').textContent).toBe('01');
    expect(unit(container, 'seconds').textContent).toBe('15');

    // 16s later: 59s remaining — the minute drops to 00
    act(() => {
      vi.advanceTimersByTime(16000);
    });
    expect(unit(container, 'minutes').textContent).toBe('00');
    expect(unit(container, 'seconds').textContent).toBe('59');
  });

  it('renders nothing once the target instant has passed', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2026, 10, 2, 0, 0, 0)));

    render(<CountdownBanner />);

    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
    expect(screen.queryByText('Premium goes live 1 November 2026')).not.toBeInTheDocument();
  });

  it('renders nothing at the exact target instant', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2026, 10, 1, 0, 0, 0)));

    render(<CountdownBanner />);

    expect(screen.queryByRole('timer')).not.toBeInTheDocument();
  });

  it('does not spam screen readers', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2026, 9, 13, 0, 0, 0)));

    render(<CountdownBanner />);

    expect(screen.getByRole('timer')).toHaveAttribute('aria-live', 'off');
    expect(screen.getByText('Countdown to 1 November 2026 at 00:00 UTC.')).toBeInTheDocument();
  });
});
