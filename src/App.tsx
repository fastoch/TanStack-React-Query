import './App.css'
import { useState } from 'react'
import { Posts } from './components/Posts'
import { PostById } from './components/PostById'

function App() {
  const [isMounted, setIsMounted] = useState(false)

  return (
    <>
      <button onClick={() => setIsMounted((prev) => !prev)}>Toggle</button>
      {isMounted && <Posts />}
      <PostById id={1} />
    </>
  )
}

export default App
