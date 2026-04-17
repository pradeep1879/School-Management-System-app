import type { NextFunction, Request, Response } from "express";

type ApiError = Error & {
  statusCode?: number;
};

export const globalErrorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err.statusCode || 400;

  console.error("ERROR:", err.message);

  res.status(statusCode).json({
    success: false,
    message: err.message, // always show real message
  });
};

// export const globalErrorHandler = (err, req, res, next) => {
//   console.log(" Global Error Middleware Hit");
//   console.error("ERROR:", err);

//   const statusCode = err.statusCode || 500;

//   res.status(statusCode).json({
//     success: false,
//     message:
//       process.env.NODE_ENV === "production"
//         ? statusCode === 500
//           ? "Internal Server Error"
//           : err.message
//         : err.message,
//     ...(process.env.NODE_ENV !== "production" && {
//       stack: err.stack,
//     }),
//   });
// };
