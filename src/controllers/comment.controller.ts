import express from "express";
import Comment, { createOneComment } from "../models/comment.models";
import { ExpressRequestExtended } from "../types/request";
import {
  findCommentByIdCustomMessage,
  findCommentById,
} from "../utils/comment/comment.utils";
import { ApiResponse } from "../utils/response";
import { findPostByIdCustomMessage } from "../utils/post/post.utils";
import { deleteUploadedImage } from "../utils";

export const getComment = async (
  req: express.Request,
  res: express.Response
) => {
  const { userId } = req as ExpressRequestExtended;
  const { commentId } = req.params;

  const comment = await findCommentById(Number(commentId), Number(userId));

  return res.status(200).json(new ApiResponse(comment, 200));
};

export const deleteComment = async (
  req: express.Request,
  res: express.Response
) => {
  const { commentId } = req.params;

  const deletedComment = await Comment.delete({
    where: {
      id: Number(commentId),
    },
    include: {
      image: {
        select: { src: true },
      },
    },
  });

  if (deletedComment.image?.src) {
    await deleteUploadedImage(deletedComment.image.src);
  }

  return res
    .status(204)
    .json(new ApiResponse(null, 204, "Comment successfully deleted."));
};

export const updateComment = async (
  req: express.Request,
  res: express.Response
) => {
  const { comment } = req.body;
  const { commentId } = req.params;

  await Comment.update({
    where: {
      id: Number(commentId),
    },
    data: {
      comment,
    },
  });

  return res
    .status(204)
    .json(new ApiResponse(null, 204, "Comment successfully updated."));
};

export const createComment = async (
  req: express.Request,
  res: express.Response
) => {
  const image = req.file;
  const { userId } = req as ExpressRequestExtended;

  const { comment, postId, parentId, imageSrc } = req.body as {
    comment: string;
    postId: number | string;
    parentId: number | string;
    imageSrc?: string;
  };

  if (parentId) {
    await findCommentByIdCustomMessage({
      commentId: Number(parentId),
      message: "Can't found comment with provided parentId",
      statusCode: 404,
      currentUserId: Number(userId),
    });
  }

  await findPostByIdCustomMessage({
    statusCode: 404,
    message: "Can't found post with provided postId",
    postId: Number(postId),
    currentUserId: Number(userId),
  });

  const result = await createOneComment({
    comment,
    postId: Number(postId),
    userId: Number(userId),
    image: imageSrc ? imageSrc : image,
    parentId: parentId || parentId === 0 ? Number(parentId) : null,
  });

  return res
    .status(201)
    .json(new ApiResponse(result, 201, "Comment successfully created."));
};

export const createReplyComment = async (
  req: express.Request,
  res: express.Response
) => {
  const image = req.file;
  const { userId } = req as ExpressRequestExtended;
  const { commentId } = req.params;
  const { comment, imageSrc } = req.body as {
    comment: string;
    imageSrc?: string;
  };

  const currentComment = await findCommentById(
    Number(commentId),
    Number(userId)
  );

  const result = await createOneComment({
    comment,
    postId: currentComment.postId,
    userId: Number(userId),
    image: imageSrc ? imageSrc : image,
    parentId: currentComment.id,
  });

  return res
    .status(201)
    .json(new ApiResponse(result, 201, "Comment successfully created."));
};
