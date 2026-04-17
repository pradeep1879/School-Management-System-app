import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodError, type ZodTypeAny } from "zod";

type RequestSchema = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

const applyParsedObject = <T extends Record<string, unknown>>(
  target: T,
  parsed: unknown,
) => {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return parsed;
  }

  for (const key of Object.keys(target)) {
    if (!(key in (parsed as Record<string, unknown>))) {
      delete target[key];
    }
  }

  Object.assign(target, parsed);
  return target;
};

export const validateRequest = (schema: RequestSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        const parsedBody = schema.body.parse(req.body);

        if (
          req.body &&
          typeof req.body === "object" &&
          !Array.isArray(req.body)
        ) {
          applyParsedObject(
            req.body as Record<string, unknown>,
            parsedBody,
          );
        } else {
          req.body = parsedBody as Request["body"];
        }
      }

      if (schema.params) {
        applyParsedObject(
          req.params as Record<string, unknown>,
          schema.params.parse(req.params),
        );
      }

      if (schema.query) {
        applyParsedObject(
          req.query as Record<string, unknown>,
          schema.query.parse(req.query),
        );
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.flatten(),
        });
      }

      next(error);
    }
  };
};
