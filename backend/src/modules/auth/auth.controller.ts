import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";
import { registerSchema, loginSchema } from "./auth.schema";

export const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.parse(req.body);

    const user = await registerUser(parsed);

    res.status(201).json(user);
  } catch (err: any) {
    if (err.errors) {
      return res.status(400).json({
        errors: err.errors, // ← important
      });
    }

    return res.status(400).json({
      error: "Registration failed",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.parse(req.body);

    const result = await loginUser(parsed);

    res.json({
      data: result,
    });
  } catch (err: any) {
    if (err.errors) {
      return res.status(400).json({
        errors: err.errors,
      });
    }

    return res.status(401).json({
      error: "Invalid credentials",
    });
  }
};
