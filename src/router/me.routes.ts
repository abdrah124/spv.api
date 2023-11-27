import express from "express";
import {
  changeMyAccountPassword,
  deleteAccountImage,
  deleteMyAccount,
  getMyAccountInfo,
  updateAccountImage,
  updateMyAccount,
} from "../controllers/account.controller";
import { tryCatch } from "../middlewares/handler.middlewares";
import { verifyToken } from "../middlewares/auth.middlewares";
import {
  deleteSavedPost,
  getAllMyPosts,
  getPostIsSaved,
  getSavedPosts,
  savePost,
} from "../controllers/post.controller";
import {
  getFollowedUser,
  getMyFollowers,
  followUser,
  unfollowUser,
} from "../controllers/follow.controller";
import { uploadImage } from "../middlewares/multer.middlewares";
import { getAllChatsByUserId } from "../controllers/chat.controller";
import {
  clearNotifications,
  createNotification,
  getAllUserNotifications,
} from "../controllers/notification.controllers";
import { blockUserById, unblockUser } from "../controllers/block.controller";
import {
  validate,
  validateBody,
  validateParamsV2,
} from "../middlewares/validator.middlewares";
import { z } from "zod";
import {
  zBirthDate,
  zFirstName,
  zGender,
  zIntId,
  zLastName,
  zNotificationType,
  zPassword,
  zProfileImageType,
  zUsername,
} from "../schema";
import { isNullUndefined } from "../utils";

const router = express.Router();

router.use(verifyToken);

router
  .route("/account")
  .get(tryCatch(getMyAccountInfo))
  .patch(
    validateBody(
      z.object({
        username: zUsername.optional(),
        description: z.string().optional(),
        firstName: zFirstName.optional(),
        lastName: zLastName.optional(),
        gender: zGender.optional(),
        birthDate: zBirthDate.optional(),
      })
    ),
    tryCatch(updateMyAccount)
  )
  .delete(
    validateBody(
      z.object({
        currentPassword: zPassword("currentPassword"),
      })
    ),
    tryCatch(deleteMyAccount)
  );

router.route("/account/changepassword").patch(
  validate(
    z.object({
      body: z
        .object({
          currentPassword: zPassword("currentPassword"),
          password: zPassword(),
          confirmPassword: zPassword("confirmPassword"),
        })
        .refine(
          (arg) => {
            if (arg.confirmPassword !== arg.password) return false;
            return true;
          },
          {
            message: "The password and confirm password do not match.",
            path: ["confirmPassword"],
          }
        ),
    })
  ),
  tryCatch(changeMyAccountPassword)
);

router
  .route("/account/images")
  .delete(
    validate(
      z.object({
        query: z.object({
          type: zProfileImageType.optional(),
        }),
      })
    ),
    tryCatch(deleteAccountImage)
  )
  .patch(
    uploadImage.single("image"),
    validate(
      z.object({
        query: z.object({
          type: zProfileImageType.optional(),
        }),
      })
    ),
    tryCatch(updateAccountImage)
  );

router
  .route("/posts/saved")
  .get(tryCatch(getSavedPosts))
  .post(
    validateBody(
      z.object({
        postId: zIntId("postId"),
      })
    ),
    tryCatch(savePost)
  );
router.route("/chats").get(tryCatch(getAllChatsByUserId));
router.route("/posts").get(tryCatch(getAllMyPosts));
router.route("/follow").post(
  validateBody(
    z.object({
      userId: zIntId("userId"),
    })
  ),
  tryCatch(followUser)
);
router.route("/block").post(
  validateBody(
    z.object({
      userId: zIntId("userId"),
    })
  ),
  tryCatch(blockUserById)
);
router.route("/following").get(tryCatch(getFollowedUser));
router.route("/followers").get(tryCatch(getMyFollowers));
router
  .route("/notifications")
  .get(
    validate(
      z.object({
        query: z.object({
          order_by: z.enum(["latest", "oldest"]).optional(),
        }),
      })
    ),
    tryCatch(getAllUserNotifications)
  )
  .delete(
    validate(
      z.object({
        query: z.object({
          before_timestamp: z
            .any()
            .refine(
              (arg) => {
                if (!Number.isNaN(Number(arg))) return true;
                if (["y", "d", "h"].some((t) => arg.endsWith(t))) return true;
                return false;
              },
              {
                message:
                  "Invalid before_timestamp query options, query options must be a number of ms or a number value followed by: h (hours), d (day), y (year). example value: 1h, 2d, 1y, 60000.",
              }
            )
            .optional(),
        }),
      })
    ),
    tryCatch(clearNotifications)
  )
  .post(
    validateBody(
      z
        .object({
          type: zNotificationType,
          postId: zIntId("postId").optional(),
          commentId: zIntId("commentId").optional(),
          receiverId: zIntId("receiverId"),
        })
        .refine(
          (arg) => {
            if (
              (arg.type === "comment" || arg.type === "replying_comment") &&
              isNullUndefined(arg.postId)
            )
              return false;
            return true;
          },
          {
            message:
              "postId is required for comment and replying_comment notification type",
            path: ["postId"],
          }
        )
        .refine(
          (arg) => {
            if (arg.type === "liking_comment" && isNullUndefined(arg.commentId))
              return false;
            return true;
          },
          {
            message:
              "commentId is required for liking_comment notification type",
            path: ["commentId"],
          }
        )
        .refine(
          (arg) => {
            if (arg.type === "liking_post" && isNullUndefined(arg.postId))
              return false;
            return true;
          },
          {
            message: "postId is required for liking_post notification type",
            path: ["postId"],
          }
        )
    ),
    tryCatch(createNotification)
  );

router
  .route("/posts/saved/:postId")
  .delete(validateParamsV2("postId"), tryCatch(deleteSavedPost));
router
  .route("/posts/saved/:postId/bookmarked")
  .get(validateParamsV2("postId"), tryCatch(getPostIsSaved));

router
  .route("/block/:userId")
  .delete(validateParamsV2("userId"), tryCatch(unblockUser));
router
  .route("/follow/:followId")
  .delete(validateParamsV2("followId"), tryCatch(unfollowUser));

export default router;