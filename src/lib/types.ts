export type Breakpoints = {
  readonly [key: string]: number
}

export type Rule = 'min-width' | 'max-width';

export type Options = {
  breakpoints?: Breakpoints;
  rule?: Rule;
}

export type MediaQueryEntry = {
  name: string | 'default';
  query: MediaQueryList | null;
  value: number | null;
  rule: Rule | null;
}
