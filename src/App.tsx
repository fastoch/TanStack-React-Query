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
