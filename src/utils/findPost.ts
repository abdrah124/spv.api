import { RequestError } from "../lib/error";
import Post from "../models/post";
import { selectPost } from "../lib/query/post";
import { normalizePost, normalizePosts } from "./normalizePost";

export const findPostById = async (postId: string) => {
  const post = await Post.findUnique({
    where: {
      id: Number(postId),
    },
    select: selectPost,
  });

  if (!post) throw new RequestError("Post not found", 404);

  return normalizePost(post);
};

export const findPostsByAuthorId = async ({
  authorId,
  offset,
  limit,
}: {
  authorId: number;
  offset?: number;
  limit?: number;
}) => {
  const posts = await Post.findMany({
    where: {
      authorId,
    },
    select: selectPost,
    take: limit ?? 20,
    skip: offset ?? 0,
  });

  const totalPosts = await Post.count({
    where: {
      authorId,
    },
  });

  return { data: normalizePosts(posts), total: totalPosts };
};

export const findAllPosts = async ({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
}) => {
  const posts = await Post.findMany({
    select: selectPost,
    skip: offset ?? 0,
    take: limit ?? 20,
  });

  const totalPosts = await Post.count({});

  return { data: normalizePosts(posts), total: totalPosts };
};

export const findPostByFollowedUserIds = async ({
  followedUserIds,
  limit = 20,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
  followedUserIds: number[];
}) => {
  const posts = await Post.findMany({
    where: {
      authorId: {
        in: [...followedUserIds],
      },
      type: {
        in: ["friends", "public"],
      },
    },
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: limit,
    distinct: ["authorId"],
    select: selectPost,
  });

  const postsTotal = await Post.count({
    where: {
      authorId: {
        in: [...followedUserIds],
      },
      type: {
        in: ["friends", "public"],
      },
    },
  });

  return { data: normalizePosts(posts), total: postsTotal };
};