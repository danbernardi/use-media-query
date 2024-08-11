import { expect, test } from 'vitest';
import { setClassName, bpIsGreaterThan, bpIsLessThan, breakpointFromString } from '../lib/utils';

test('setClassName', () => {
  const classObj = {
    default: 'default-class',
    lg: 'lg-class',
    md: 'md-class',
    sm: 'sm-class',
  };

  const options = {
    breakpoints: {
      lg: 1000,
      md: 700,
      sm: 400,
    },
    rule: 'min-width',
  };

  expect(setClassName(classObj, { name: 'default' }, options)).toBe('default-class');
  expect(setClassName({lg: 'lg-class'}, { name: 'default', value: null }, options)).toBe('');
  expect(setClassName(classObj, { name: 'lg'}, options)).toBe('lg-class');
  expect(setClassName(classObj, { name: 'md'}, options)).toBe('md-class');
  expect(setClassName(classObj, { name: 'sm'}, options)).toBe('sm-class');
  // Throws an error if the classObj contains a key that is not in options.breakpoints
  expect(() => setClassName({invalid: 'class'}, { name: 'default' }, options)).toThrowError('Bad breakpoint variable given: invalid. Available breakpoints: lg, md, sm');
});

test('bpIsGreaterThan', () => {
  const options = {
    breakpoints: {
      lg: 1000,
      md: 700,
      sm: 400,
    },
    rule: 'min-width',
  };

  const mediaQuery = { name: 'md', value: 700 };

  expect(bpIsGreaterThan('lg', mediaQuery, options)).toBe(false);
  expect(bpIsGreaterThan('sm', mediaQuery, options)).toBe(true);
  // Throws error if breakpoints are not defined
  expect(() => bpIsGreaterThan('lg', mediaQuery, {})).toThrowError('Breakpoints must be defined');
});

test('bpIsLessThan', () => {
  const options = {
    breakpoints: {
      lg: 1000,
      md: 700,
      sm: 400,
    },
    rule: 'min-width',
  };

  const mediaQuery = { name: 'md', value: 700 };

  expect(bpIsLessThan('lg', mediaQuery, options)).toBe(true);
  expect(bpIsLessThan('sm', mediaQuery, options)).toBe(false);
  // Throws error if breakpoints are not defined
  expect(() => bpIsGreaterThan('lg', mediaQuery, {})).toThrowError('Breakpoints must be defined');
});

test('breakpointFromString', () => {
  const options = {
    breakpoints: {
      lg: 1000,
      md: 700,
      sm: 400,
    },
    rule: 'min-width',
  };

  expect(breakpointFromString('lg', options.breakpoints)).toBe(1000);
  expect(breakpointFromString('md', options.breakpoints)).toBe(700);
  expect(breakpointFromString('sm', options.breakpoints)).toBe(400);
  // Throws error if passed breakpoint string is not a key in breakpoints
  expect(() => breakpointFromString('invalid', options.breakpoints)).toThrowError('Bad breakpoint variable given: invalid. Available breakpoints: lg, md, sm');
});
