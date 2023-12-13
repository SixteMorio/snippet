import express from "express";

import jwt from "jsonwebtoken";

import createError from "http-errors";

import { PrismaClient } from "@prisma/client";

import bcrypt from "bcrypt";

import RegisterValidator from "../../validators/RegisterValidator.js";
import LoginValidator from "../../validators/LoginValidator.js";

const prisma = new PrismaClient();

const router = express.Router();

router.post("/register", async (req, res, next) => {
  let data;
  try {
    data = RegisterValidator.parse(req.body);
  } catch (error) {
    return res.status(400).json({ errors: error.issues });
  }

  const { email, firstname, lastname, password, photo } = data;

  // existing user ?
  const existingUser = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (existingUser) {
    return next(createError(400, "User already exists"));
  }

  const SALT = 10;
  const hashedPassword = bcrypt.hashSync(password, SALT);

  // create
  const entry = await prisma.user.create({
    data: {
      email,
      firstname,
      lastname,
      password: hashedPassword,
      photo,
    },
  });

  res.status(201).json({
    id: entry.id,
    email: entry.email,
    firstname: entry.firstname,
    lastname: entry.lastname,
    photo: entry.photo,
  });
});

router.post("/login", async (req, res, next) => {
  let data;
  try {
    data = LoginValidator.parse(req.body);
  } catch (error) {
    return res.status(400).json({ errors: error.issues });
  }

  const { email, password } = data;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return next(createError(403, "Wrong email or password"));
  }

  // check the password is right
  const isGoodPassword = bcrypt.compareSync(password, user.password);

  if (!isGoodPassword) {
    return next(createError(403, "Wrong email or password"));
  }

  // puis on renvoie le token
  res.json({
    token: jwt.sign(
      // payload
      {
        name: "user.token",
      },
      // clef pour signer le token
      process.env["JWT_KEY"],
      // durée du token
      {
        expiresIn: "30m",
      }
    ),
  });
});

export default router;
