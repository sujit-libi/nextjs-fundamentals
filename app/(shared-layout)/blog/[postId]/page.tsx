import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { fetchQuery } from 'convex/nextjs';
import { ArrowBigLeft, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PostIdRouteProps {
  params: Promise<{
    postId: Id<'posts'>;
  }>;
}

export default async function PostIdRoute({ params }: PostIdRouteProps) {
  const { postId } = await params;
  const post = await fetchQuery(api.posts.getPostById, { postId: postId });
  if (!post) {
    return (
      <div>
        <h1 className="text-6xl font-extrabold text-red-500 py-20"></h1>
      </div>
    );
  }
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link
        className={buttonVariants({
          variant: 'outline',
          className: 'mb-4',
        })}
        href="/blog"
      >
        <ArrowLeft className="size-4" />
        Back to blog
      </Link>

      <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={
            post.imageUrl ??
            'https://intothecommerce.com/wp-content/uploads/2024/09/What-Is-Technology-The-Definition-Types-and-Impacts-1024x602.jpg'
          }
          alt={post.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>

        <p className="text-sm text-muted-foreground">
          Posted on: {new Date(post._creationTime).toLocaleDateString('en-US')}
        </p>
      </div>

      <Separator className="my-8" />

      <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {post.body}
      </p>

      <Separator className="my-8" />
    </div>
  );
}
