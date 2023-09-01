import { Prisma } from "@prisma/client";
import { selectPost } from "./post";

export const selectUserPublic = {
  id: true,
  username: true,
  createdAt: true,
  profile: {
    select: {
      profileDescription: true,
      avatarImage: {
        select: {
          id: true,
          src: true,
        },
      },
    },
  },
  followedBy: {
    select: {
      id: true,
      username: true,
    },
  },
  following: {
    select: {
      id: true,
      username: true,
    },
  },
  posts: {
    take: 5,
    select: selectPost,
  },
} satisfies Prisma.UserSelect;

export type SelectUserPublicPayload = Prisma.UserGetPayload<{
  select: typeof selectUserPublic;
}>;

export const selectUser = {
  id: true,
  username: true,
  email: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  profile: {
    select: {
      profileDescription: true,
      avatarImage: {
        select: {
          id: true,
          src: true,
        },
      },
    },
  },

  followedBy: {
    select: {
      id: true,
      username: true,
    },
  },
  following: {
    select: {
      id: true,
      username: true,
    },
  },
  posts: {
    select: selectPost,
  },
} satisfies Prisma.UserSelect;

export type SelectUserPayload = Prisma.UserGetPayload<{
  select: typeof selectUser;
}>;
