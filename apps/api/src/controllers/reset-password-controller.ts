import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';

// import { registerSchema } from '../schemas/auth-schemas.js';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const { genSalt, hash } = bcrypt;

export async function requestResetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) {
      res.status(200).json({
        ok: true,
        message:
          'If your email exists in our system, you will receive a password reset link',
      });
      return;
    }

    // Generate reset password token
    const resetPasswordToken = crypto.randomBytes(20).toString('hex');
    const confirmationLink = `http://localhost:3000/auth/confirm-reset-password?token=${resetPasswordToken}`;

    await prisma.resetPasswordToken.create({
      data: {
        expiredDate: new Date(Date.now() + 1000 * 60 * 15),
        token: resetPasswordToken,
        userId: existingUser.id,
      },
    });

    const templateSource = await fs.readFile(
      'src/templates/reset-password-confirmation-template.hbs',
    );
    const compiledTemplate = handlebars.compile(templateSource.toString());
    const htmlTemplate = compiledTemplate({
      name: existingUser.name,
      link: confirmationLink,
    });
    const { data, error } = await resend.emails.send({
      from: 'Fresh Basket <onboarding@frshbasket.shop>',
      to: email,
      subject: 'Reset your password',
      html: htmlTemplate,
    });

    if (error) {
      res.status(400).json({ error, data });
      return;
    }

    res.status(200).json({
      ok: true,
      message:
        'If your email exists in our system, you will receive a password reset link',
    });
  } catch (error) {
    next(error);
  }
}

export async function confirmResetToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.query.token;

    if (!token) {
      res.status(400).json({ message: 'Token is required' });
      return;
    }

    const tokenRecord = await prisma.resetPasswordToken.findFirst({
      where: { token: token.toString() },
    });

    if (
      !tokenRecord ||
      tokenRecord.used ||
      tokenRecord.expiredDate < new Date()
    ) {
      res.status(400).json({ message: 'Invalid or expired token!' });
      return;
    }

    // Return success response with token for the frontend to use
    res.status(200).json({
      ok: true,
      message: 'Token is valid',
      token: token.toString(),
      userId: tokenRecord.userId,
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({ message: 'Token and password are required' });
      return;
    }

    const tokenRecord = await prisma.resetPasswordToken.findFirst({
      where: { token },
    });

    if (
      !tokenRecord ||
      tokenRecord.used ||
      tokenRecord.expiredDate < new Date()
    ) {
      res.status(400).json({ message: 'Invalid or expired token!' });
      return;
    }

    // Hash the new password
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    // Update user password
    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { password: hashedPassword },
    });

    // Mark token as used
    await prisma.resetPasswordToken.update({
      where: { id: tokenRecord.id },
      data: { used: true },
    });

    res.status(200).json({ ok: true, message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
}
