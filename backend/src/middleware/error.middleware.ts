import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  if (err.name === "ZodError") {
    const fields: Record<string, string> = {};

    err.errors.forEach((e: any) => {
      fields[e.path[0]] = e.message;
    });

    return res.status(400).json({
      error: "validation failed",
      fields,
    });
  }

  return res.status(500).json({
    error: err.message || "Internal server error",
  });
};