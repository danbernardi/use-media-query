import { createContext } from 'react';
import { useMediaQuery, type UseMediaQueryReturnType, Options } from './lib/use-media-query';

export const MediaQueryContext = createContext<UseMediaQueryReturnType>({} as UseMediaQueryReturnType);

export const MediaQueryProvider = ({ children, options }: { children: React.ReactElement, options?: Options }) => {
  const mediaQuery = useMediaQuery(options ?? {});
  
  return (
    <MediaQueryContext.Provider value={mediaQuery}> 
      { children }
    </MediaQueryContext.Provider>
  )
}
