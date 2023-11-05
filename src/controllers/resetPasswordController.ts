import express from "express";
import User from "../models/user";
import { sendResetPasswordEmail } from "../utils/sendEmail";
import Token from "../models/token";
import { baseUrl } from "../lib/baseUrl";
import { RequestError } from "../lib/error";
import bcrypt from "bcrypt";
import { getRandomToken } from "../utils/getRandomToken";
import { jSuccess } from "../utils/jsend";

export const sendResetToken = async (
  req: express.Request,
  res: express.Response
) => {
  const { email } = req.body;

  const user = await User.findUnique({
    where: {
      email,
    },
  });

  const resetToken: string = await getRandomToken();

  const now = Date.now();

  if (user) {
    await Token.create({
      data: {
        token: resetToken,
        type: "reset_token",
        expires_in: new Date(now + 300 * 1000),
        userEmail: email,
      },
    });

    await sendResetPasswordEmail(
      email,
      `http://localhost:3000/resetpassword/${resetToken}`
    );
  }

  res.status(200).json(
    jSuccess({
      message: `If a matching account was found, an email was sent to ${email} to allow you to reset your password.`,
    })
  );
};

export const resetPassword = async (
  req: express.Request,
  res: express.Response
) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (confirmPassword !== password)
    throw new RequestError("Password and confirm password does not match", 422);

  const resetToken = await Token.findUnique({
    where: {
      AND: {
        type: "reset_token",
      },
      token,
    },
  });

  if (!resetToken) throw new RequestError("Invalid Token!", 401);
  if (resetToken.expires_in.getTime() < Date.now())
    throw new RequestError("Token already expired", 401);

  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT)
  );

  await User.update({
    where: {
      email: resetToken.userEmail,
    },
    data: {
      hashedPassword,
    },
  });

  await Token.deleteMany({
    where: {
      userEmail: resetToken.userEmail,
      type: "reset_token",
    },
  });

  res.status(200).json(
    jSuccess({
      message:
        "Password successfully reset. You can now use the new password to log in.",
    })
  );
};
