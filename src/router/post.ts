import express from "express";
import { tryCatch, tryCatchMiddleware } from "../middlewares/tryCatch";
import {
  createPost,
  deletePost,
  deletePostImageById,
  deletePostImagesByPostId,
  getAllPosts,
  getFollowedUserPost,
  getPost,
  getPostCommentsById,
  updatePost,
} from "../controllers/postController";
import { isAdmin, verifyToken } from "../middlewares/auth";
import { protectPost } from "../middlewares/protectPost";
import { uploadImage } from "../utils/uploadImage";
import {
  createLike,
  deleteLike,
  getPostLikesByPostId,
} from "../controllers/postLikeController";
import { protectLike } from "../middlewares/protectLike";

const router = express.Router();
router
  .route("/")
  .post(verifyToken, uploadImage.array("images"), tryCatch(createPost))
  .get(verifyToken, isAdmin, tryCatch(getAllPosts));

router.route("/following").get(verifyToken, tryCatch(getFollowedUserPost));

router.route("/:postId/comments").get(tryCatch(getPostCommentsById));

router
  .route("/:postId/likes")
  .get(tryCatch(getPostLikesByPostId))
  .post(verifyToken, tryCatch(createLike))
  .delete(verifyToken, tryCatchMiddleware(protectLike), tryCatch(deleteLike));

router
  .route("/:postId")
  .get(tryCatch(getPost))
  .patch(
    verifyToken,
    tryCatchMiddleware(protectPost),
    uploadImage.array("images"),
    tryCatch(updatePost)
  )
  .delete(verifyToken, tryCatchMiddleware(protectPost), tryCatch(deletePost));

router
  .route("/:postId/images/:imageId")
  .delete(
    verifyToken,
    tryCatchMiddleware(protectPost),
    tryCatch(deletePostImageById)
  );
router
  .route("/:postId/images")
  .delete(
    verifyToken,
    tryCatchMiddleware(protectPost),
    tryCatch(deletePostImagesByPostId)
  );

export default router;
