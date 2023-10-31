import { Prisma } from "@prisma/client";

export const selectAuthorPost = {
  author: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      profile: { select: { avatarImage: { select: { src: true } } } },
    },
  },
} satisfies Prisma.PostSelect;

export type SelectAuthorPost = Prisma.PostGetPayload<{
  select: typeof selectAuthorPost;
}>;

export const selectPost = {
  id: true,
  title: true,
  content: true,
  updatedAt: true,
  _count: { select: { likes: true, comments: true } },
  images: {
    select: {
      id: true,
      src: true,
    },
  },
  ...selectAuthorPost,
  comments: {
    where: {
      parentId: null,
    },
    select: {
      id: true,
    },
  },
  createdAt: true,
} satisfies Prisma.PostSelect;

export type SelectPostPayload = Prisma.PostGetPayload<{
  select: typeof selectPost;
}>;
