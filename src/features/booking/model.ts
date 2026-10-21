import { z } from "zod";
import { dateSchema, timeSchema } from "@/features/home-service/model";

export const bookingSchema = z.object({
  meetingDate: dateSchema,
  preferredTime: timeSchema,
  email: z.string().trim().toLowerCase().email("invalid_email").max(255),
  lang: z.enum(["fi", "sv", "es", "en"]),
});

export const bookingRequestSchema = bookingSchema.extend({
  idempotencyKey: z.string().uuid(),
  website: z.string().max(0).optional(),
});
