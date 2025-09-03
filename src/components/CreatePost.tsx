import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'

export const CreatePost = () => {
  const [title, setTitle] = useState('')

  const {} = useMutation()

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    // mutate
    console.log(title)
  }

  return (
    <>
      <h1>Let's create a post</h1>
      <form>
        <input type="text" placeholder="Post title..." onChange={(e) => setTitle(e.target.value)}/>
        <button onClick={handleSubmit}>Create</button>
      </form>
    </>
  )
}