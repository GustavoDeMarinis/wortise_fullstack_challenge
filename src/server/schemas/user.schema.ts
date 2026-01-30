import { z } from "zod";

export const userSchema = z.object({
  _id: z.string(),
  email: z.email(),
  name: z.string().min(1),
  createdAt: z.date(),
});

export type User = z.infer<typeof userSchema>;