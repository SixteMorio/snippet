import { z } from "zod";

const FolderValidator = z.object({
  name: z.string().min(1),
  user_id: z.number(),
});

export default FolderValidator;