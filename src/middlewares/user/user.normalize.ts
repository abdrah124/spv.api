import {
  SelectUserPayload,
  SelectUserPublicPayload,
  SelectUserSimplifiedPayload,
} from "../../lib/query/user";
import {
  UserAccount,
  UserAccountPublic,
  UserSimplifiedWF,
} from "../../types/user";
import { getCompleteFileUrlPath } from "..";

type SelectUserPublicPayloadExtended = SelectUserPublicPayload;
type SelectUserPayloadExtended = SelectUserPayload;

const getIds = (
  data: SelectUserPayload | SelectUserPublicPayload,
  types: "followedBy" | "following" | "posts"
) => {
  return [...(data?.[types]?.map((user) => user?.id) ?? [])];
};

export const normalizeUserPublic = (
  user: SelectUserPublicPayloadExtended,
  isFollowed: boolean
): UserAccountPublic => {
  const normalizedUserPublic: UserAccountPublic = {
    id: user?.id,
    isFollowed,
    isOnline: user?.isOnline,
    firstName: user?.firstName,
    lastName: user?.lastName,
    fullName: user?.fullName,
    username: user?.username,
    profile: user.profile
      ? {
          birthDate: user.profile?.birthDate,
          gender: user.profile?.gender,
          description: user.profile.profileDescription,
          avatarImage: getCompleteFileUrlPath(user.profile.avatarImage),
          coverImage: getCompleteFileUrlPath(user.profile.coverImage),
        }
      : null,
    followedBy: {
      followerIds: getIds(user, "followedBy"),
      total: user._count.followedBy,
    },
    following: {
      followedUserIds: getIds(user, "following"),
      total: user._count.following,
    },
    posts: { postIds: getIds(user, "posts"), total: user._count.posts },
    updatedAt: user.updatedAt,
    createdAt: user?.createdAt,
  };

  return normalizedUserPublic;
};

export const normalizeUser = (
  user: SelectUserPayloadExtended,
  isFollowed: boolean
): UserAccount => {
  const normalizedUser: UserAccount = {
    id: user?.id,
    isFollowed,
    isOnline: user?.isOnline,
    provider: user?.provider,
    firstName: user?.firstName,
    lastName: user?.lastName,
    fullName: user?.fullName,
    username: user?.username,
    email: user?.email,
    verified: user?.verified,
    role: user?.role,
    profile: user.profile
      ? {
          birthDate: user.profile?.birthDate,
          gender: user.profile?.gender,
          description: user.profile.profileDescription,
          avatarImage: getCompleteFileUrlPath(user.profile.avatarImage),
          coverImage: getCompleteFileUrlPath(user.profile.coverImage),
        }
      : null,
    followedBy: {
      followerIds: getIds(user, "followedBy"),
      total: user._count.followedBy,
    },
    following: {
      followedUserIds: getIds(user, "following"),
      total: user._count.following,
    },
    posts: { postIds: getIds(user, "posts"), total: user._count.posts },
    createdAt: user?.createdAt,
    updatedAt: user?.updatedAt,
  };
  // if (user.profile?.avatarImage && normalizedUser.profile) {
  //   normalizedUser.profile.image = {
  //     src: new URL(user.profile.avatarImage.src, BASE_URL).href,
  //   };
  // }
  return normalizedUser;
};

export const simplifyUser = (
  user:
    | SelectUserPayloadExtended
    | SelectUserSimplifiedPayload
    | SelectUserPublicPayloadExtended,
  isFollowed: boolean
): UserSimplifiedWF => {
  return {
    isFollowed,
    avatarImage: getCompleteFileUrlPath(user.profile?.avatarImage),
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: user?.fullName,
    id: user.id,
    isOnline: user.isOnline,
    username: user.username,
  };
};
