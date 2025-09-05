src = https://www.youtube.com/watch?v=e74rB-14-m8  

date = January 2025

---

# Intro

In this comprehensive tutorial, we dive into the core features of React Query (now known as TanStack React Query),
and demonstrate how it simplifies **data fetching** and **state management** in your React applications.  

We'll delve into advanced topics like **caching**, **data invalidation**, and working with **mutations** to create and update data.  

---

# Why do we need TanStack Query?

- Because "**state management**" in a React app can be very complex.  
- Because constant "**refetching**" kills our app's performance

"TanStack React Query is the ultimate tool for effortless data fetching, caching, and real-time updates."  

---

# Project setup

- open a new folder in VSCodium
- run `npm create vite@latest`
- project name = `.` (cureent folder)
- framework = React
- variant = TypeScript
- run `npm i`
- install TanStack via `npm i @tanstack/react-query`

---

# Configuring TanStack Query client

Once TanStack has been installed, open the **entry point** of your app, most likely `/src/main.tsx`.  
There, we need to define the **query client**.  
We have to do that at the highest level of our application, so the entire project has access to React Query.  

In our `main.tsx` file (or whichever file is your entry point):
```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const client = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
```

Now, we can access the different hooks and functions provided by TanStack from anywhere in our app.  

---

# Fetching data from an API

We'll use the **jsonplaceholder** API.  

- in the `App.tsx`component, remove everything in the `return` statement except for the empty fragment
- then, remove useless imports and useState

The initial `App.tsx` file should look like that:
```tsx
import './App.css'

function App() {

  return (
    <>
      
    </>
  )
}

export default App
```

To fetch data from the jsonplaceholder API, we'll use the `useQuery` hook from TanStack Query.  

Here's how our `App.tsx` file looks like now:
```tsx
import './App.css'
import { useQuery } from '@tanstack/react-query'

const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  if (!response.ok) throw new Error("Error fetching data")
  return response.json()
}

type Post = {
  id: number;
  title: string;
  body: string;
}

function App() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  if (isLoading) return <span>Loading...</span>

  if (error) return <span>Error: {(error as Error).message}</span>

  return (
    <div className="App">
      <h1>Posts</h1>
      {/* while fetching data, the type is 'undefined', hence the question mark below */}
      {data?.map((post) => <article key={post.id}><h2>{post.title}</h2></article>)}
    </div>
  )
}

export default App
```

And here's how our `Posts.tsx` component looks like:
```tsx
import { useQuery } from '@tanstack/react-query'

const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  if (!response.ok) throw new Error("Error fetching data")
  return response.json()
}

export type Post = {
  id: number;
  title: string;
  body: string;
}

export const Posts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  })

  if (isLoading) return <span>Loading...</span>

  if (error) return <span>Error: {(error as Error).message}</span>

  return (
    <>
      <h1>Posts</h1>
      {/* while fetching data, the type is 'undefined', hence the question mark below */}
      {data?.map((post) => <article key={post.id}><h3>{post.title}</h3></article>)}
    </>
  )
}
```

## Most common hooks in React Query

- `useQuery`
- `useMutation`

## The `useQuery` hook

It requires 2 parameters:
- a list of query **keys**: which will help us **identify** each of our queries
- a function which is going to fetch the data from the API

## Stop using `useEffect`

`useEffect` was never created with the intention of being used to fetch data.  

---

# Caching 

TanStack Query automatically caches the responses of our fetch queries.  
So by default, if we revisit the component, it will show us the cached data instead of fetching it again.  

We can also choose to refetch the data after a certain amount of time.  
To do that, we need to use the `staleTime` property of the `useQuery` hook.  
After the specified delay (in ms), the data will be fetched again.  

In our `Posts.tsx` file:
```tsx
export const Posts = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 10000,
  })
```

## Use caching instead of fetching data again and again

Without TanStack Query caching feature, our components fetch data every time they get mounted.  

---

# Fetching data by ID

Here's the `PostById.tsx`:
```tsx
import { useQuery } from '@tanstack/react-query'
import type { Post } from './Posts'

const fetchPostById = async (id: number): Promise<Post> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
  if (!response.ok) throw new Error("Error fetching data")
  return response.json()
}

export const PostById = ({ id }: { id: number }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', id],
    queryFn: () => fetchPostById(id),
    staleTime: 10000,
  })

  if (isLoading) return <span>Loading...</span>

  if (error) return <span>Error: {(error as Error).message}</span>

  return (
    <>
      <h1>PostById</h1>
      {data && (
        <article key={data.id}>
          <h2>{data.title}</h2>
        </article>
      )}
    </>
  )
}
```

And the return statement in our App:
```tsx
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
```

---

# Introduction to Mutations

Here's the `CreatePost.tsx` file:
```tsx
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
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

  // useMutation returns a mutate function
  const { mutate } = useMutation<Post, Error, NewPost>({
    mutationFn: createPost,
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
```

---

# Adding new posts to the list provided by jsonplaceholder

When we click on **Create** to simulate a new post creation, we want to see it displayed 
at the bottom of our list of posts.  

**WARNING**: this won't actually update the data on the jsonplaceholder's server, which is why our new post won't show up.  
But we should see the corresponding POST request in the dev tools (network tab).  
Later on, when explaining "optimistic updates", we'll see how to make the new posts show up.

To add a new post, we need to **refetch** the data inside our `Posts` component every time we create a new post.  

## How to do that?

In the `useMutation` of our `CreatePost` component, we need to add the `onSuccess` property.  

If the post gets successfully created, then we will invalidate the query that we do in the `Posts` component.  
This way, the `data` we get from the `useQuery` in the `Posts` component will automatically get **refetch**ed.  

To allow the `CreatePost` component to access the query inside the `Posts` component, 
we also need to import and use the `useQueryClient` hook.  
```tsx
import { useQueryClient } from '@tanstack/react-query'

// ...

export const CreatePost = () => {
  const [title, setTitle] = useState('')

  const queryClient = useQueryClient()

  // useMutation returns a mutate function
  const { mutate } = useMutation<Post, Error, NewPost>({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts']})
    },
  })
```

When the new post creation is a success, we invalidate all `'posts'` queries (those are the queries 
we make in the `Posts` component), which makes the Posts component refetch the data to include the new post.  

In our example, we're using the jsonplaceholder API, so we're not able to actually add a new post, 
which is why it doesn't show up after the data has been refetched.  

But if we were to use an API to which we could really post data, the newly created post would show up.

---

# Local vs server-side state managment

This is why we need to use TanStack React Query.  
Because it allows us to control the state of our server data.  

With `useState` or `useContext`, we know how to manage the state of our local data.  
But to deal with the different states of our application on the server, we need to use TanStack Query.  

TanStack Query allows us to synchronize data between the server of our app (the backend) and the UI.  
This is one of the best tools to make our app production-ready.  

---

# Implementing Optimistic Updates 

Optimistic updates in the context of TanStack Query is a **technique** where the UI is immediately updated 
to reflect a **predicted** state change before the actual server mutation (like POST, PUT, DELETE) completes.  

This creates a fast and responsive user experience by "optimistically" assuming the server operation will succeed, 
thus avoiding any delay that would otherwise happen while waiting for the server response.  

If the server mutation actually fails, React Query will roll back the change.  
But if a significant amount of our requests fail, then we need to fix our backend code.  

## How to implement optimistic updates?

In our call to the `useMutation` function in the `CreatePost` component, we need to add the `onMutate` callback.  

- This callback takes an async function that is executed before the actual mutation (the API call to create a new post) 
happens, and it receives the same variable as the mutation function: `newPost`

- The next line cancels any currently running queries where the query key is `['posts']`, which prevents a 
background refetch

- `previousPosts` receives the current data in the query cache for `['posts']`, so we have a backup of the old state,
which can be used to roll back the UI if the mutation fails

- the `.setQueryData` line it the "optimistic" part, where we are immediately updating the local cache by 
adding the new post to the existing list.

```tsx
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
```

Now, if we create a new post, we should see it for a brief moment at the bottom of our list.  
It disappears because of the `onSuccess` callback that invalidates the query (which triggers a data refetch).  
But if we comment out the `onSuccess` block, it will persist, and we can even add more posts to the list.  

## We should also handle errors

With the `onError` callback of course.  

```tsx

```