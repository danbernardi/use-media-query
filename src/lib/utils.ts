import type { Breakpoints, MediaQueryEntry, Options } from './use-media-query';

/**
 * Returns a string of classes that match / are adjacent to the current breakpoint
 * @param {classObj}  classObj               Obj containing key / value pairs for desired breakpoints
 * @param {Object}    breakpoint             Obj describing current breakpoint state
 * @param {string}    breakpoint.name        String defining current breakpoint name
 * @param {number}    breakpoint.value       Number defining current breakpoint size
 * @param {Object}    options                Object containing breakpoints and rule
 * @param {Object}    options.breakpoints    Object containing breakpoints ([name]: size)
 * @param {string}    options.rule           String indicating the rule to use (max-width or min-width)
 * @return {string}                          Returns class string that matches correct breakpoint
 */
 export function setClassName(
  classObj: Record<keyof Breakpoints | 'default', string>,
  mediaQuery: MediaQueryEntry,
  options: Required<Options>
): string {
  const breakPointArr =  Object.keys(options.breakpoints);
  Object.keys(classObj).forEach((key) => {
    if ([...breakPointArr, 'default'].indexOf(key) === -1) {
      throw new Error(`Bad breakpoint variable given: ${key}. Available breakpoints: ${breakPointArr.join(', ')}`);
    }
  });

  const def = classObj?.default || '';

  if (mediaQuery.name === 'default') return def;

  const sizeArray = options.rule === 'max-width' ? [...breakPointArr.reverse()] : breakPointArr;
  const startingIndex = sizeArray.indexOf(mediaQuery.name);
  const firstMatchedKey = sizeArray
    .slice(startingIndex)
    .find(key => classObj[key]) || 'default';

  return firstMatchedKey === 'default'
    ? def
    : classObj[firstMatchedKey];
}

export function breakpointFromString(string: string, bps: Breakpoints): number {
  const breakpoint = bps[string];

  if (!breakpoint) {
    throw new Error(`Bad breakpoint variable given: ${string}. Available breakpoints: ${Object.keys(bps).join(', ')}`);
  }

  return breakpoint;
}

/**
 * Returns a boolean indicating whether or not the currentBreakpoint.size value
 * is greater than the passed breakpointToCompare value
 * @param {Object}    breakpointToCompare        String or number, if string, it is used to retrieve
 *                                               the correct value from breakpoints[]
 * @param {Object}    currentBreakpoint          Object describing current breakpoint
 * @param {number}    currentBreakpoint.value    Number indicating the current breakpoint value
 * @param {Object}    options                    Object containing breakpoints and rule
 * @param {Object}    options.breakpoints        Object containing breakpoints ([name]: size)
 * @param {string}    options.rule               String indicating the rule to use (max-width or min-width)
 * @return {boolean}                             Returns boolean that indicates whether the passed
 *                                               breakpointToCompare string or number is currently
 *                                               greater than the currentBreakpoint
 */
export const bpIsGreaterThan = (
  breakpointToCompare: keyof Breakpoints,
  currentBreakpoint: MediaQueryEntry,
  options: Options
): boolean => {
  if (options.breakpoints === undefined) {
    throw new Error('Breakpoints must be defined');
  }

  const comparison = typeof breakpointToCompare === 'string'
    ? breakpointFromString(breakpointToCompare, options.breakpoints)
    : breakpointToCompare;

  if (currentBreakpoint.value === null || currentBreakpoint.value > comparison) {
    return true;
  } else {
    return false;
  }
};

/**
 * Returns a boolean indicating whether or not the currentBreakpoint.size value
 * is less than the passed breakpointToCompare value
 * @param {Object}    breakpointToCompare        String or number, if string, it is used to retrieve
 *                                               the correct value from options.breakpoints[]
 * @param {Object}    currentBreakpoint          Object describing current breakpoint
 * @param {number}    currentBreakpoint.value    Number indicating the current breakpoint value
 * @param {Object}    options                    Object containing breakpoints and rule
 * @param {Object}    options.breakpoints        Object containing breakpoints ([name]: size)
 * @param {string}    options.rule               String indicating the rule to use (max-width or min-width)
 * @return {boolean}                             Returns boolean that indicates whether the passed
 *                                               breakpointToCompare string or number is currently
 *                                               less than the currentBreakpoint
 */
export const bpIsLessThan = (
  breakpointToCompare: keyof Breakpoints,
  currentBreakpoint: MediaQueryEntry,
  options: Options
): boolean => {
  if (options.breakpoints === undefined) {
    throw new Error('Breakpoints must be defined');
  }

  const comparison = typeof breakpointToCompare === 'string'
    ? breakpointFromString(breakpointToCompare, options.breakpoints)
    : breakpointToCompare;

  if (currentBreakpoint.value !== null
      && currentBreakpoint.value <= comparison) {
    return true;
  } else {
    return false;
  }
};
