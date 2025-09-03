import { useQuery } from '@tanstack/react-query'

const fetchPostById = async (id: number): Promise<Post> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
  if (!response.ok) throw new Error("Error fetching data")
  return response.json()
}

type Post = {
  id: number
  title: string
  body: string
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
