import express from "express";

import { expressjwt } from "express-jwt";

const auth = expressjwt({
  secret: process.env["JWT_KEY"],
  algorithms: ["HS256"],
});

const router = express.Router();

router.get("/secret", auth, (req, res) => {
  res.json({ msg: "bravo, tu as accès à cette route" });
});

export default router;
