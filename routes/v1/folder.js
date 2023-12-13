import express from "express";

import createError from "http-errors";

import { expressjwt } from "express-jwt";

import { PrismaClient } from "@prisma/client";

import FolderValidator from "../../validators/FolderValidator.js";

const prisma = new PrismaClient();

const router = express.Router();

const auth = expressjwt({
  secret: process.env["JWT_KEY"],
  algorithms: ["HS256"],
});

//folders
router.get('/', auth, async (req, res, next) => {
  const userId = req.auth.id;

  const userFolders = await prisma.folder.findMany({
    where: {
      user_id: userId,
    },
  });

  res.json(userFolders);
});

router.post('/', auth, async (req, res, next) => {
  const userId = req.auth.id;

  let folder;
  try {
    folder = FolderValidator.parse(req.body);
  } catch (error) {
    return res.status(400).json({ errors: error.issues });
  }

  const newFolder = await prisma.folder.create({
    data: {
      name: folder.name,
      user: {
        connect: {
          id: folder.user_id,
        }
      }
    },
  });

  res.status(201).json(newFolder);
});

router.patch("/:id", auth, async (req, res) => {
  const userId = req.auth.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return next(createError(404, "User not find"));
  }

  const id = parseInt(req.params.id)

  let folder;
  try {
    folder = FolderValidator.parse(req.body);
  } catch (error) {
    return res.status(400).json({ errors: error.issues });
  }

  const data = {}
  if (folder.name) {
    data['name'] = folder.name
  }

  const updatedFolder = await prisma.folder.update({
    where: { id },
    data: {
      name: folder.name,
    },
  });

  res.status(200).json(updatedFolder);
});

router.delete("/:id", auth, async (req, res) => {
  const userId = req.auth.id;

  const id = parseInt(req.params.id)

  const deletedSnippet = await prisma.folder.delete({
    where: { id },
  });

  res.status(200).json(deletedSnippet);
});

export default router;