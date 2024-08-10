import viteLogo from '/vite.svg'
import './App.css'
import { MediaQueryContext } from './lib/context';
import { useContext } from 'react';

function Child() {
  const {
    setClass,
    bpIsGT,
    bpIsLT,
    breakpoints,
  } = useContext(MediaQueryContext);

  return (
    <>
      <div style={{ backgroundColor: setClass({default: 'pink', lg: 'red', md: 'blue', sm: 'green'}) }}>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>

        {bpIsGT('md') && <h1>Show me above md - {breakpoints.md}</h1>}
        {bpIsLT('md') && <h1>Show me below md - {breakpoints.md}</h1>}
      </div>
    </>
  )
}

export default Child;
