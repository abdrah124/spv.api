import prisma from "../config/prismaClient";
const Comment = prisma.comment;
const CommentLike = prisma.commentLike;

export const createOneComment = async ({
  comment,
  postId,
  userId,
  parentId,
  image,
}: {
  comment: string;
  postId: number;
  parentId?: number | null;
  userId: number;
  image?: string | undefined;
}) =>
  await prisma.$transaction(async (tx) => {
    const createdComment = await tx.comment.create({
      data: {
        comment,
        parentId,
        postId,
        userId,
      },
      include: {
        post: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (image) {
      await tx.image.create({
        data: {
          src: image,
          commentId: createdComment.id,
        },
      });
    }

    return createdComment;
  });

export { CommentLike };
export default Comment;
