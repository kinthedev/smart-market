import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = result.error.issues || (result.error as any).errors || [];
      const firstError = issues[0];
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: firstError ? `${firstError.path.join(".")}: ${firstError.message}` : "Dữ liệu không hợp lệ.",
        errors: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data;
    return next();
  };
}