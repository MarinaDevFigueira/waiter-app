import { ZodError } from "zod";

export function formatZodError(error: ZodError): string {
  const flattened = error.flatten();
  const fieldErrors = flattened.fieldErrors;
  const formErrors = flattened.formErrors;

  const fieldMessages = Object.entries(fieldErrors).flatMap(([field, messages]) => {
    const validMessages = Array.isArray(messages) ? messages : [];
    return validMessages.map((message) => `${field}: ${message}`);
  });

  const allMessages = [...formErrors, ...fieldMessages];

  const hasMessages = allMessages.length > 0;
  if (hasMessages) {
    return allMessages.join("; ");
  }

  return error.message;
}

export function isZodError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}
