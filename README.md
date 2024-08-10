# useMediaQuery
useMediaQuery is a custom react hook that allows the use of css media queries in a react environment.

### Setup

*npm:*
```
npm install @dbernardi/useMediaQuery
```

*yarn:*
```
yarn add @dbernardi/useMediaQuery
```

The best way to use these breakpoint helpers is by utilizing React context to set up a custom context provider.

1. Add the following Provider to the top level of your app -- preferrably wrapping the App component. Breakpoint state will only be available to components that are children of this top level component.
``` jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { BreakpointProvider } from '@dbernardi/useMediaQuery';
import App from './App.js';

ReactDOM.render(
  <React.StrictMode>
    <BreakpointProvider>
      <App />
    </BreakpointProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
```

2. Now, you can simply use the `useMediaQueryContext` hook anywhere in your app to consume the breakpoint state:
``` jsx
import { useMediaQueryContext } from '@dbernardi/useMediaQuery';
import SubComponent from './SubComponent';
import './App.scss';


function App() {
  const {
    // See below for information on how each of these variables can be used
    setClass,
    bpIsGT,
    bpIsLT,
    currentBreakpoint,
    breakpoints
  } = useMediaQueryContext();

  return (
    <div className={ `App ${setClass({ default: '', mobileLg: 'border' })}` }>
      { bpIsGT('mobileLg') && <SubComponent /> }
    </div>
  );
}

export default App;

```

You should now be able to make use of the breakpoint state in your components. It should update its value as you resize the width of your browser. Just like our scss handlers, the breakpoint system assumes a desktop first responsive flow. This means that breakpoints are active in reverse order from largest to smallest, with smaller breakpoints overriding larger ones. If your viewport is greater than the largest breakpoint, the `default` breakpoint is active.

*Note: the `useMediaQuery` hook is importable from `@dbernardi/useMediaQuery/useMediaQuery` in case you only need to use this functionality in a single component, and wish to avoid using react context. However, it is not recommended to use this hook if you want to use the breakpoint helpers in more than one component (especially on the same page), because it will create breakpoint event listeners for every `useMediaQuery` instance. To avoid redundant events, use `useMediaQueryContext`.

## Helper functions and integration

In order to allow your components to make use of the breakpoint state, we've provided a series of helper functions, these are automatically returned when using `useMediaQueryContext` but can be imported directly from `@dbernardi/useMediaQuery/useMediaQuery`.

### Adding the helper functions to your component

The helper functions can be destructured from the object returned from `useMediaQueryContext`. This injects the following breakpoint helpers into your component:  
breakpoints  
bpIsGT  
bpIsLT  
setClass  

The use of these helpers will be explained below.
``` jsx
import { useMediaQueryContext } from '@dbernardi/useMediaQuery/useMediaQuery';

const Component = (props) => {
  const { breakpoints, bpIsGT, bpIsLT, setClass } = useMediaQueryContext();

  return (
    <div>
      Test component
    </div>
  );
};

export default Component;
```

#### breakpoints
`breakpoints` is an object that lists all the available breakpoints. For each breakpoint, the key equals the breakpoint name and the value equals the breakpoint width in pixels.

``` js
const breakpoints = {
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

#### bpIsGT - breakpointIsGreaterThan
This function returns a boolean indicating whether the currently active breakpoint is larger than the passed breakpoint param. The breakpoint param is a `string` that matches one of the keys in `breakpoints`.

```jsx
bpIsGt('mobileLg')
  ? <p>I will only appear on screens larger than 767px</p>
  : <p>I will only appear on screens smaller than 767px</p>
```

#### bpIsLT - breakpointIsLessThan
This function returns a boolean indicating whether the currently active breakpoint is smaller than the passed breakpoint param. The breakpoint param is a `string` that matches one of the keys in `breakpoints`.

```jsx
bpIsLt('mobileLg')
  ? <p>I will only appear on screens smaller than 767px</p>
  : <p>I will only appear on screens larger than 767px</p>
```

#### setClass
This function is used to return a string (often but not limited to a className) that matches / is adjacent to the currently active breakpoint.

It accepts an object as a param with key value pairs describing which strings should be returned for which matched breakpoints. For each breakpoint, the value of the match will be returned. The breakpoints are read in reverse order, with larger breakpoints active first. When a breakpoint is active, it will remain active until the next breakpoint key finds a match. It is not necessary to provide values for all of the available breakpoints, only the breakpoints at which point the string should change.

This is most commonly used to change the className of an element based on the active breakpoint:
``` jsx
<div className={ setClass({
    default: 'larger-than-mobile-lg',
    mobileLg: 'mobileLg-and-below-but-greater-than-mobileSm',
    mobileSm: 'mobileSm-and-below'
  }) }>
  Some content
</div>
```

However, it can also be used anywhere a string can be used. Another example is to use setClass in association with inline styles:

``` jsx
import { useMediaQueryContext } from '@dbernardi/useMediaQuery/useMediaQuery';

const Component = (props) => {
  const { setClass } = useMediaQueryContext();

  const dynamicStyles = {
    width: setClass({ default: '300px', mobileLg: '500px' })
  };

  return (
    <div style={ dynamicStyles }>
      Some content
    </div>
  )
}
```