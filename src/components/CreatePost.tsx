import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { Post } from './Posts'

const createPost = async (newPost: Post) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify(newPost),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) throw new Error("Error creating post")
  return response.json()
}

export const CreatePost = () => {
  const [title, setTitle] = useState('')

  const {} = useMutation({
    mutationFn: createPost,
  
  })

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