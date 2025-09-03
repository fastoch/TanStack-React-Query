import { useState } from 'react'

export const CreatePost = () => {
  const [title, setTitle] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // mutate
    console.log(title)
  }

  return (
    <>
      <h1>Let's create a post</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Post title..." onChange={(e) => setTitle(e.target.value)}/>
        <button>Create</button>
      </form>
    </>
  )
}