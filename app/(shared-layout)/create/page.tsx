'use client';

import { createBlogAction } from '@/app/actions';
import { postSchema } from '@/app/schemas/blog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/convex/_generated/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

export default function CreateRoute() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const mutation = useMutation(api.posts.createPost);
  const form = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
      image: undefined,
    },
  });

  /**
   *
   * Client Side Mutation
   *
   */

  // function onSubmit(values: z.infer<typeof postSchema>) {
  //   startTransition(async () => {
  //     mutation({
  //       title: values.title,
  //       body: values.content,
  //     });

  //     // Route Handler Example
  //     // await fetch('/api/create-blog', {
  //     //   method: 'POST',
  //     // });
  //     toast.success('Blog Post Created Successfully!!!!');
  //     router.push('/');
  //   });
  // }

  /**
   *
   * Server Side Mutation
   *
   */

  function onSubmit(values: z.infer<typeof postSchema>) {
    startTransition(async () => {
      // Server Action
      await createBlogAction(values);
    });
  }

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Create Post
        </h1>
        <p className="text-xl text-muted-foreground pt-4">
          Share your thoughts with the big world!!!
        </p>
      </div>
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle>Create Blog Article.</CardTitle>
          <CardDescription>Create a new blog article.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-y-4">
              <Controller
                name="title"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Title</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="Node JS Tutorial"
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="content"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Content</FieldLabel>
                    <Textarea
                      aria-invalid={fieldState.invalid}
                      placeholder="Lets begin the tutorial."
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Image</FieldLabel>
                    <Input
                      aria-invalid={fieldState.invalid}
                      placeholder="Lets begin the tutorial."
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        field.onChange(file);
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Button disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin size-4" />
                    <span>Creating Post...</span>
                  </>
                ) : (
                  <span>Create Post</span>
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
