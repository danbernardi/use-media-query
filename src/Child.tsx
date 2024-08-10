import viteLogo from '/vite.svg'
import './App.css'
import { useMediaQuery } from './lib/use-media-query'

function Child() {
  const {
    setClass,
    bpIsGT,
    bpIsLT,
    breakpoints,
  } = useMediaQuery({ breakpoints: {lg: 1000, md: 800, sm: 400} });

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
