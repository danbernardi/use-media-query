import './App.css'
import Child from './Child';
import { MediaQueryProvider } from './lib/context';

function App() {
  return (
    <MediaQueryProvider options={{ breakpoints: { sm: 600, md: 900, lg: 1200 }, rule: 'max-width' }}>
      <>
        <Child />
        <Child />
      </>
    </MediaQueryProvider>
  )
}

export default App
