import express from "express";
import { findChatById } from "../utils/chat/chat.utils";
import { ExpressRequestExtended } from "../types/request";
import { ForbiddenError } from "../lib/error";

export const protectChat = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { userId } = req as ExpressRequestExtended;
  const { messageId } = req.params;

  const chat = await findChatById(Number(messageId));
  if (chat.author.id !== Number(userId)) throw new ForbiddenError();

  return next();
};