import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { bpIsGreaterThan, bpIsLessThan, setClassName } from './utils';

export const defaultBreakpoints: Breakpoints = {
  desktopLg: 1400,
  desktopMd: 1300,
  desktopSm: 1200,
  tabletLg: 1040,
  tabletMd: 991,
  tabletSm: 840,
  mobileLg: 767,
  mobileMd: 540,
  mobileSm: 400,
  mobileXsm: 350
};

export const noMatch: MediaQueryEntry = {
  name: 'default',
  query: null,
  value: null,
  rule: null,
};

export type UseMediaQueryReturnType = {
  currentBreakpoint: MediaQueryEntry;
  setClass: (obj: Record<keyof Breakpoints | 'default', string>) => string;
  bpIsGT: (comparison: keyof Breakpoints) => boolean;
  bpIsLT: (comparison: keyof Breakpoints) => boolean;
  breakpoints: Breakpoints;
};

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

export const useMediaQuery = (options: Options = {}): UseMediaQueryReturnType => {
  const config: Required<Options> = useMemo(() => ({
    breakpoints: options.breakpoints ?? defaultBreakpoints,
    rule: options.rule ?? 'min-width',
  }), [options]);

  const mediaQueries = useMemo(() => generateMediaQueries(config), [config]);

  const subscribe = useCallback(
    (callback: () => void) => {
      const unsubscribers: (() => void)[] = [];

      mediaQueries.forEach(({ query }) => {
        query?.addEventListener('change', callback)
        unsubscribers.push(() => query?.removeEventListener('change', callback))
      })

      return () => unsubscribers.forEach((unsubscriber) => unsubscriber())
    },
    [mediaQueries],
  )

  const getSnapshot = useCallback(() => {
    const mediaQueryList = config.rule === 'max-width' ? [...mediaQueries].reverse() : [...mediaQueries]; 
    const match = mediaQueryList.find(entry => entry.query?.matches);

    return match ?? noMatch;
  }, [mediaQueries, config.rule])


  const currentBreakpoint = useSyncExternalStore(
    subscribe,
    getSnapshot,
  );

  const setClass = useCallback(
    (obj: Record<keyof Breakpoints, string | 'breakpoint'>) => setClassName(obj, currentBreakpoint, config),
  [currentBreakpoint, config]);

  const bpIsGT = useCallback(
    (comparison: keyof Breakpoints) => bpIsGreaterThan(comparison, currentBreakpoint, config),
  [currentBreakpoint, config]);

  const bpIsLT = useCallback(
    (comparison:  keyof Breakpoints) => bpIsLessThan(comparison, currentBreakpoint, config),
  [currentBreakpoint, config]);

  return { currentBreakpoint, setClass, bpIsGT, bpIsLT, breakpoints: config.breakpoints };
}

export const generateMediaQueries = (options: Required<Options>): MediaQueryEntry[] => {
  const mediaQueryList: MediaQueryEntry[] = [];
  const sortedBreakpoints: string[] = Object.keys(options.breakpoints).sort((a, b) => options.breakpoints[b] - options.breakpoints[a]);

  sortedBreakpoints.forEach((key) => {
    const value = options.breakpoints[key];
    const query = window.matchMedia(`only screen and (${options.rule}: ${value}px)`);
    const name = key;
    mediaQueryList.push({
      name,
      query,
      value,
      rule: options.rule || null
    });
  })

  return mediaQueryList;
}