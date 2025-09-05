import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Post } from './Posts'

type NewPost = Omit<Post, 'id'>

const createPost = async (newPost: NewPost) => {
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

  const queryClient = useQueryClient()

  // useMutation returns a mutate function
  const { mutate } = useMutation<Post, Error, NewPost>({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts']})
    },
    onMutate: async (newPost) => {
      // cancel any running queries for new posts (backup data)
      await queryClient.cancelQueries({ queryKey: ['posts'] })
      // get the current list of posts from the query cache 
      const previousPosts = queryClient.getQueryData<Post[]>(['posts'])
      // immediately update the local cache by adding the newPost to the list
      queryClient.setQueryData(["posts"], (old: Post[] | undefined) => [...(old || []), {...newPost }])
      return { previousPosts } // returning the backup in case the API call fails and a rollback is needed)
    },
  })

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    mutate({ title, body: "This is a new post" })
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