import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/atoms/Button';

test('Button renders correctly', () => {
  render(<Button>Click me</Button>);
  const btn = screen.getByRole('button', { name: /click me/i });
  expect(btn).toBeDefined();
  expect(btn.className).toContain('bg-cyan-500');
});

test('Button supports variants', () => {
  render(<Button variant="danger">Delete</Button>);
  const btn = screen.getByRole('button', { name: /delete/i });
  expect(btn.className).toContain('bg-danger-500');
});
