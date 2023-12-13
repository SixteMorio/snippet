import express from "express";

import createError from "http-errors";

import { expressjwt } from "express-jwt";

import SnippetValidator from "../../validators/SnippetValidator.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();

const auth = expressjwt({
  secret: process.env["JWT_KEY"],
  algorithms: ["HS256"],
});

//snippet
router.get('/', auth, async (req, res, next) => {
  const userId = req.auth.id;
  const folderId = parseInt(req.params.folderId);
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
  const language = req.params.language;

  const options = {
    skip: (page - 1) * itemsPerPage,
    take: itemsPerPage,
    orderBy: {
      language: language ? { _count: 'desc' } : 'asc',
    },
  };

  const snippets = await prisma.snippet.findMany(options);

  res.json(snippets);
});

router.post('/', auth, async (req, res) => {
  const userId = req.auth.id;

  let snippet;
  try {
    snippet = SnippetValidator.parse(req.body);
  } catch (error) {
    return res.status(400).json({ errors: error.issues });
  }

  const newSnippet = await prisma.snippet.create({
    data: {
      title: snippet.title,
      language: snippet.language,
      content: snippet.content,
      folder: {
        connect: {
          id: snippet.folder_id,
        }
      }
    },
  });

  res.status(201).json(newSnippet);
});

router.patch("/:id", auth, async (req, res) => {
  const userId = req.auth.id;

  const id = parseInt(req.params.id)

  let snippet;
  try {
    snippet = SnippetValidator.parse(req.body);
  } catch (error) {
    return res.status(400).json({ errors: error.issues });
  }

  const data = {}
  if (snippet.title) {
    data['title'] = snippet.title
  }
  if (snippet.content) {
    data['content'] = snippet.content
  }


  const updatedSnippet = await prisma.snippet.update({
    where: { id }
    ,
    data
  });

  res.status(200).json(updatedSnippet);
});

router.delete("/:id", auth, async (req, res) => {
  const userId = req.auth.id;

  const id = parseInt(req.params.id)

  const deletedSnippet = await prisma.snippet.delete({
    where: { id },
  });

  res.status(200).json(deletedSnippet);
});

export default router;