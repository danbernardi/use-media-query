import { createContext } from 'react';
import { useMediaQuery, type UseMediaQueryReturnType } from './use-media-query';
import { Options } from './types';

export const MediaQueryContext = createContext<UseMediaQueryReturnType>({} as UseMediaQueryReturnType);

export const MediaQueryProvider = ({ children, options }: { children: React.ReactElement, options?: Options }) => {
  const mediaQuery = useMediaQuery(options);
  
  return (
    <MediaQueryContext.Provider value={mediaQuery}> 
      { children }
    </MediaQueryContext.Provider>
  )
}
