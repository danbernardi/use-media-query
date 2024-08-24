# useMediaQuery
useMediaQuery is a custom react hook that allows the use of css media queries in a react environment. It uses the `matchMedia` api to subscribe to media queries and returns the current breakpoint state. It also provides helper functions to make it easier to use the breakpoint state in your components.

### Installation
```
pnpm add @dbernardi/use-media-query
```

## Usage
While the `useMediaQuery` hook can be called directly by each component that needs to use it, it is recommended to utilize a global state library to manage the state of the hook in a centralized location. This allows the hook to be consumed by any component in the app, and makes sure the media query state is only subscribed to once.

You can use any state library, for example Redux or Zustand. However, the simplest way to do this is to use [React context](https://react.dev/reference/react/useContext), which is a built-in feature of React.

Examples are provided in typescript below, but the same concepts apply to javascript. Just remove the type annotations.

1. Create a context provider that subscribes to the useMediaQuery hook.
``` jsx
// context.tsx
import { createContext } from 'react';
import { useMediaQuery } from '@dbernardi/use-media-query';
import type { UseMediaQueryReturnType, Options } from '@dbernardi/use-media-query';

export const MediaQueryContext = createContext<UseMediaQueryReturnType>({} as UseMediaQueryReturnType);

export const MediaQueryProvider = ({ children, options }: { children: React.ReactElement, options?: Options }) => {
  const mediaQuery = useMediaQuery(options ?? {});
  
  return (
    <MediaQueryContext.Provider value={mediaQuery}> 
      { children }
    </MediaQueryContext.Provider>
  )
}
```

2. Wrap the provider around a component high in your app chain and pass in the options you want to use.
``` jsx
// App.tsx
import { MediaQueryProvider } from './context';

function App({children}: {children: React.ReactElement}) {
  return (
    <MediaQueryProvider options={{ breakpoints: { sm: 600, md: 900, lg: 1200 }, rule: 'max-width' }}>
      {children}
    </MediaQueryProvider>
  )
}

export default App;
```


3. Now, you can use react's `useContext` hook in conjuction with `MediaQueryContext` to consume the breakpoint state:
``` jsx
import { MediaQueryContext } from './context';
import { useContext } from 'react';

function Component() {
  const {
    setClass,
    bpIsGT,
    bpIsLT,
    breakpoints,
  } = useContext(MediaQueryContext);

  return (
    <div style={{ backgroundColor: setClass({default: 'pink', lg: 'red', md: 'blue', sm: 'green'}) }}>
      {bpIsGT('md') && <h1>Show me above md - {breakpoints.md}</h1>}
      {bpIsLT('md') && <h1>Show me below md - {breakpoints.md}</h1>}
    </div>
  )
}

export default Component;
```

## Options
The following options can be passed to the useMediaQuery hook:

| Option | Description |
| --- | --- |
| breakpoints | An object containing the breakpoints you want to use. The key should be the name of the breakpoint and the value should be the size in pixels. |
| rule | The rule to use when subscribing to the media query. Can be either 'min-width' or 'max-width' to denote whether to use a mobile-first or desktop-first media query. Media queries will be constucted as followed: ``only screen and (${rule}: ${breakpoints[key]}px)``. | 

### Default options

The default options are as follows:

*breakpoints*
``` ts
const defaultBreakpoints = {
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
```

*rule*
``` ts
'max-width'
```


## Helper functions & return values

In order to allow your components to make use of the breakpoint state, we've provided a series of helper functions, these are automatically returned from the `useMediaQuery` hook.

```
const {
  currentBreakpoint,
  bpIsGT,
  bpIsLT,
  setClass,
  breakpoints,
} = useContext(MediaQueryContext);
```

### currentBreakpoint
`currentBreakpoint` is an object that contains the current breakpoint state. It has the following properties:

| Property | Description |
| --- | --- |
| name | The name of the current breakpoint. This matches one of the keys in the `breakpoints` object passed to the `useMediaQuery` hook. |
| value | The size of the current breakpoint in pixels. |
| query | The `MediaQueryList` object that is subscribed to the current breakpoint. |
| rule | The rule used to subscribe to the current breakpoint. This is the same as the `rule` option passed to the `useMediaQuery` hook. |

#### bpIsGT - breakpointIsGreaterThan
This function returns a boolean indicating whether the currently active breakpoint is larger than the passed breakpoint param. The breakpoint param is a `string` that matches one of the keys in `breakpoints`.

```jsx
bpIsGt('md')
  ? <p>I will only appear on screens larger than 900px</p>
  : <p>I will only appear on screens smaller than 900px</p>
```

#### bpIsLT - breakpointIsLessThan
This function returns a boolean indicating whether the currently active breakpoint is smaller than the passed breakpoint param. The breakpoint param is a `string` that matches one of the keys in `breakpoints`.

```jsx
bpIsLt('md')
  ? <p>I will only appear on screens smaller than 900px</p>
  : <p>I will only appear on screens larger than 900px</p>
```

#### setClass
This function is used to return a string (often but not limited to a className) that matches / is adjacent to the currently active breakpoint.

It accepts an object as a param with key value pairs describing which strings should be returned for which matched breakpoints. For each breakpoint, the value of the match will be returned. When the `rule` option is set to `max-width`, the breakpoints are read in reverse order, with larger breakpoints active first. This behavior is reversed when the `rule` option is set to `min-width`, with smaller breakpoints being active first. When a breakpoint is active, it will remain active until the next breakpoint key finds a match. It is not necessary to provide values for all of the available breakpoints, only the breakpoints at which point the string should change.

This is most commonly used to change the className of an element based on the active breakpoint:
``` jsx
<div className={ setClass({
    default: 'larger-than-md',
    md: 'md-and-below-but-greater-than-sm',
    sm: 'sm-and-below'
  }) }>
  Some content
</div>
```

However, it can also be used anywhere a string can be used. Another example is to use setClass in association with inline styles:

``` jsx
import { MediaQueryContext } from './context.ts';

const Component = (props) => {
  const { setClass } = useContext(MediaQueryContext);

  const dynamicStyles = {
    width: setClass({ default: '300px', md: '500px' })
  };

  return (
    <div style={ dynamicStyles }>
      Some content
    </div>
  )
}
```

#### breakpoints
`breakpoints` is an object that lists all the available breakpoints. This is identical to the `breakpoints` option passed to the `useMediaQuery` hook.