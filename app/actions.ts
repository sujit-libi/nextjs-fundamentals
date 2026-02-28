'use server';

import z from 'zod';
import { postSchema } from './schemas/blog';
// import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { redirect } from 'next/navigation';
import { fetchAuthMutation, getToken } from '@/lib/auth-server';
import { fetchMutation } from 'convex/nextjs';

export async function createBlogAction(values: z.infer<typeof postSchema>) {
  const parsed = postSchema.safeParse(values);

  if (!parsed.success) throw new Error('Something went wrong!!!');

  // const token = await getToken()

  // await fetchMutation(
  //   api.posts.createPost,
  //   {
  //     body: parsed.data.content,
  //     title: parsed.data.title,
  //   },
  //   {
  //     token,
  //   },
  // );

  try {
    const imageUrl = await fetchAuthMutation(
      api.posts.generateImageUploadUrl,
      {},
    );
    const uploadResult = await fetch(imageUrl, {
      method: 'POST',
      headers: {
        'Content-Type': parsed.data.image.type,
      },
      body: parsed.data.image,
    });

    if (!uploadResult.ok) {
      return {
        error: 'Failed to upload image.',
      };
    }

    const { storageId } = await uploadResult.json();
    await fetchAuthMutation(api.posts.createPost, {
      body: parsed.data.content,
      title: parsed.data.title,
      imageStorageId: storageId,
    });
  } catch (error) {
    console.error('Something went wrong: ', error);
    return {
      error: 'Failed to create post.',
    };
  }

  return redirect('/blog');
}
