import { getPostResponse } from '@mcc/schema/api';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { Post } from '../../components/Post';
import { PostForm } from '../../components/PostForm';

export const Route = createFileRoute('/posts/$id')({
  component: Page,
})

function Page() {
  const { id } = Route.useParams();
  const query = useQuery({
    queryKey: ['posts', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8787/api/posts/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch post");
      }

      const json = await response.json();
      const data = getPostResponse.parse(json);
      return data;
    }
  })

	return (
		<div className="flex flex-col gap-4">
			{query.data?.post && <Post post={query.data.post} />}
      <PostForm />
      <div className="flex flex-col gap-4">
        {query.data?.replies.map((reply) => (
          <Post key={reply.id} post={reply} />
        ))}
      </div>
		</div>
	);
}
