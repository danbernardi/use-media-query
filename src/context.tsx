import { createContext } from 'react';
import { useMediaQuery } from '../dist';
import type { UseMediaQueryReturnType, Options } from '../dist';

export const MediaQueryContext = createContext<UseMediaQueryReturnType>({} as UseMediaQueryReturnType);

export const MediaQueryProvider = ({ children, options }: { children: React.ReactElement, options?: Options }) => {
  const mediaQuery = useMediaQuery(options ?? {});
  
  return (
    <MediaQueryContext.Provider value={mediaQuery}> 
      { children }
    </MediaQueryContext.Provider>
  )
}
