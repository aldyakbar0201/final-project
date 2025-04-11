import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import handlebars from 'handlebars';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const { genSalt, hash, compare } = bcrypt;

// Login untuk admin
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Missing required fields!' });
      return;
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!existingUser) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    if (!existingUser.emailConfirmed) {
      res.status(400).json({ message: 'Please complete your registration' });
      return;
    }

    const isValidPassword = await compare(password, existingUser.password);

    if (!isValidPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
    }

    const jwtPayload = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role,
    };
    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY as string, {
      expiresIn: '1h',
    });

    res
      .cookie('accessToken', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        domain: 'localhost',
      })
      .status(200)
      .json({ ok: true, message: 'Login success' });
  } catch (error) {
    next(error);
  }
}

// Get all users (only for super admin)
export async function getAllUsers(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const users = await prisma.user.findMany();
    res.json(users); // Kirim respons tanpa return
  } catch (error) {
    next(error); // Lanjutkan ke error handler
  }
}

// Get user by ID (only for super admin)
export async function getUserById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = parseInt(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return; // Hentikan eksekusi fungsi
    }

    res.json(user); // Kirim respons tanpa return
  } catch (error) {
    next(error); // Lanjutkan ke error handler
  }
}

// Create a new user (only for super admin)
export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ message: 'Missing required fields' });
      return; // Hentikan eksekusi fungsi
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ message: 'Email has already been taken' });
      return; // Hentikan eksekusi fungsi
    }

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        referralCode: new Date().getTime().toString(), // Generate referral code
      },
    });

    res.status(201).json(newUser); // Kirim respons tanpa return
  } catch (error) {
    next(error); // Lanjutkan ke error handler
  }
}

// Update user by ID (only for super admin)
export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = parseInt(req.params.id);
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      res.status(404).json({ message: 'User not found' });
      return; // Hentikan eksekusi fungsi
    }

    let hashedPassword = existingUser.password;
    if (password) {
      const salt = await genSalt(10);
      hashedPassword = await hash(password, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.json(updatedUser); // Kirim respons tanpa return
  } catch (error) {
    next(error); // Lanjutkan ke error handler
  }
}

// Delete user by ID (only for super admin)
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = parseInt(req.params.id);

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      res.status(404).json({ message: 'User not found' });
      return; // Hentikan eksekusi fungsi
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(204).send(); // Kirim respons tanpa return
  } catch (error) {
    next(error); // Lanjutkan ke error handler
  }
}

// Send email confirmation (optional, bisa digunakan untuk admin)
export async function sendConfirmationEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return; // Hentikan eksekusi fungsi
    }

    const confirmToken = crypto.randomBytes(20).toString('hex');
    const confirmationLink = `http://localhost:8000/api/v1/auth/confirm-email?token=${confirmToken}`;

    await prisma.confirmToken.create({
      data: {
        expiredDate: new Date(Date.now() + 1000 * 60 * 5), // Token expires in 5 minutes
        token: confirmToken,
        userId: user.id,
      },
    });

    const templateSource = await fs.readFile(
      'src/templates/email-confirmation-template.hbs',
      'utf-8',
    );
    const compiledTemplate = handlebars.compile(templateSource);
    const htmlTemplate = compiledTemplate({
      name: user.name,
      link: confirmationLink,
    });

    const { data, error } = await resend.emails.send({
      from: 'Admin Panel <admin@example.com>',
      to: email,
      subject: 'Confirm Your Email',
      html: htmlTemplate,
    });

    if (error) {
      res.status(400).json({ error });
      return; // Hentikan eksekusi fungsi
    }

    res.status(200).json({ message: 'Confirmation email sent', data }); // Kirim respons tanpa return
  } catch (error) {
    next(error); // Lanjutkan ke error handler
  }
}
