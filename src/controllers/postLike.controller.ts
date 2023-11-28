import { PostLike } from "../models/post.models";
import express from "express";
import { ExpressRequestExtended } from "../types/request";
import { RequestError } from "../lib/error";
import { ApiResponse } from "../utils/response";
import {
  excludeBlockedUser,
  excludeBlockingUser,
  selectUserSimplified,
} from "../lib/query/user";
import { findPostById } from "../utils/post/post.utils";
// CONTINUe
export const getPostLikesByPostId = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId } = req as ExpressRequestExtended;
  const { postId } = req.params;

  await findPostById(postId, Number(userId));
  selectUserSimplified;
  const likes = await PostLike.findMany({
    where: {
      postId: Number(postId),
      user: {
        ...excludeBlockedUser(Number(userId)),
        ...excludeBlockingUser(Number(userId)),
      },
    },
    select: {
      userId: true,
      postId: true,
      user: {
        select: {
          ...selectUserSimplified,
        },
      },
    },
  });

  const count = await PostLike.count({
    where: {
      postId: Number(postId),
    },
  });

  const normalizedLikes = await Promise.all(
    likes.map((like) =>
      Promise.resolve({
        id: like.userId,
        firstName: like.user.firstName,
        lastName: like.user.lastName,
        username: like.user.username,
        profilePhoto: like.user.profile?.avatarImage,
      })
    )
  );

  return res.status(200).json(
    new ApiResponse(
      {
        postId: Number(postId),
        likedBy: normalizedLikes,
        total: count,
      },
      200
    )
  );
};

export const createLike = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId } = req as ExpressRequestExtended;
  const { postId } = req.params;

  const postAlreadyLiked = await PostLike.findUnique({
    where: {
      userId_postId: {
        userId: Number(userId),
        postId: Number(postId),
      },
    },
  });

  if (postAlreadyLiked)
    throw new RequestError("You already liked this post", 409);

  const createdLike = await PostLike.create({
    data: {
      userId: Number(userId),
      postId: Number(postId),
    },
  });

  return res.status(201).json(new ApiResponse(createdLike, 201));
};

export const deleteLike = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId } = req as ExpressRequestExtended;
  const { postId } = req.params;

  await PostLike.delete({
    where: {
      userId_postId: { userId: Number(userId), postId: Number(postId) },
    },
  });

  return res.status(204).json(new ApiResponse(null, 204));
};

export const getPostIsLiked = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId } = req as ExpressRequestExtended;
  const { postId } = req.params;

  const isLiked = await PostLike.findFirst({
    where: {
      postId: Number(postId),
      userId: Number(userId),
    },
  });

  return res.status(200).json(new ApiResponse(isLiked ? true : false, 200));
};
