import './App.css'
import { useState } from 'react'
import { Posts } from './components/Posts'

function App() {
  const [isMounted, setIsMounted] = useState(false)

  return (
    <>
      <button onClick={() => setIsMounted((prev) => !prev)}>Toggle</button>
      {isMounted && <Posts />}
    </>
  )
}

export default App
