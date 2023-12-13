import { z } from "zod";

const SnippetValidator = z.object({
  title: z.string().min(5).max(255),
  language: z.string().min(3),
  content: z.string(),
  folder_id: z.number(),
});

export default SnippetValidator;