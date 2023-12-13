import express from "express";

import authRouter from "./v1/auth.js";
import snippetRouter from "./v1/snippet.js";
import folderRouter from "./v1/folder.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/snippets", snippetRouter);
router.use("/folders", folderRouter);

export default router;
