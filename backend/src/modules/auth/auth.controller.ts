import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.schema";

export const register = async (req: Request, res: Response) => {
  const parsed = registerSchema.parse(req.body);

  const user = await registerUser(parsed);

  res.status(201).json({
    data: user,
  });
};

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.parse(req.body);

  const result = await loginUser(parsed);

  res.json({
    data: result,
  });
};
