import { z } from "zod";

export const phoneValidationSc = z.string()
    .regex(
        /^\+\d{1,2}\s\(\d{3}\)\s\d{3}-\d{4}$|^\+\d{1,2}\s\(\d{3}\)\s\d{9}$/,
        "Invalid Phone Number, please provide it in international format +94 (123) 456-7890",
    )
    .min(1, "phone is Required")