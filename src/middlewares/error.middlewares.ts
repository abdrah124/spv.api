import express from "express";
import { ApiError } from "../utils/response";
import { errorsMessage } from "../lib/consts";

export const error = async (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  let statusCode = err?.statusCode ?? 400;
  let message = err?.message ?? "";
  let name = err?.name ?? "";
  let errors = err?.errors ?? [];
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json(new ApiError(413, errorsMessage.FILE_TOO_BIG));
  }
  switch (name) {
    case "JsonWebTokenError":
      {
        statusCode = 401;
        message = "Invalid token.";
      }
      break;
    case "TokenExpiredError":
      {
        statusCode = 403;
        message = "Token expired.";
      }
      break;
    case "PrismaClientRustPanicError":
      {
        statusCode = 400;
      }
      break;
    case "PrismaClientKnownRequestError":
      {
        statusCode = 400;
      }
      break;
    case "PrismaClientUnknownRequestError":
      {
        statusCode = 400;
      }
      break;
    case "PrismaClientValidationError":
      {
        statusCode = 422;
      }
      break;
    case "PrismaClientInitializationError":
      {
        statusCode = 400;
      }
      break;
    case "ZodError":
      {
        statusCode = 422;
        errors = err.issues;
        name = err.name;
      }
      break;
    default: {
      if (!statusCode) statusCode = 500;
      if (!message) message = "Something went wrong!";
    }
  }

  return res
    .status(statusCode)
    .json(new ApiError(statusCode, message, errors, name));
};
