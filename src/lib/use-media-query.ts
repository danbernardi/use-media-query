import { useCallback, useMemo, useSyncExternalStore } from 'react'

type Breakpoints = {
  [key: string]: number
}

type Rule = 'min-width' | 'max-width';

type Options = {
  breakpoints?: Breakpoints;
  rule?: Rule;
}

type MediaQueryEntry = {
  breakpoint: string | 'default';
  query: MediaQueryList | null;
  value: number | null;
  rule: Rule | null;
}

const defaultBreakpoints: Breakpoints = {
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

const noMatch: MediaQueryEntry = {
  breakpoint: 'default',
  query: null,
  value: null,
  rule: null,
} as const;

export const useMediaQuery = (options: Options = {}) => {
  const breakpoints = options.breakpoints ?? defaultBreakpoints;
  const rule = options.rule ?? 'min-width';
  const mediaQueries = useMemo(() => generateMediaQueries(breakpoints, rule), [breakpoints, rule]);

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
    const mediaQueryList = rule === 'max-width' ? [...mediaQueries].reverse() : [...mediaQueries]; 
    const match = mediaQueryList.find(entry => entry.query?.matches); 

    return match ?? noMatch;
  }, [mediaQueries, rule])


  const current = useSyncExternalStore(
    subscribe,
    getSnapshot,
  );

  return current;
}

const generateMediaQueries = (breakpoints: Breakpoints, rule: Rule): MediaQueryEntry[] => {
  const mediaQueryList = [];

  for (const key in breakpoints) {
    const value = breakpoints[key];
    const query = window.matchMedia(`only screen and (${rule}: ${value}px)`);
    const breakpoint = key;
    mediaQueryList.push({
      breakpoint,
      query,
      value,
      rule
    });
  }

  return mediaQueryList;
}