import './App.css'
import { useState } from 'react'
import { Posts } from './components/Posts'
import { PostById } from './components/PostById'
import { CreatePost } from './components/CreatePost'

function App() {
  const [isMounted, setIsMounted] = useState(false)

  return (
    <>
      <button onClick={() => setIsMounted((prev) => !prev)}>Toggle</button>
      {isMounted && <Posts />}
      <hr />
      <PostById id={1} />
      <hr />
      <CreatePost />
    </>
  )
}

export default App
