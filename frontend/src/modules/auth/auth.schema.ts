import { z } from "zod"

const VALIDATE = {
    pwdMin: 6,
    pwdMax: 20,
    nameMin: 3,
    nameMax: 10,
    regexName: /^[A-Za-zก-ฮ]+$/
}

export const registerSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().trim().min(VALIDATE.pwdMin, {
        message: `Password must be at least ${VALIDATE.pwdMin} characters`,
    }).max(VALIDATE.pwdMax, {
        message: `Password must be at most ${VALIDATE.pwdMax} characters`,
    }),
    confirm_password: z.string().trim().min(VALIDATE.pwdMin, {
        message: `ConfirmPassword must be at least ${VALIDATE.pwdMin} characters`,
    }).max(VALIDATE.pwdMax, {
        message: `ConfirmPassword must be at most ${VALIDATE.pwdMax} characters`,
    }),
    name: z.string().trim().min(VALIDATE.nameMin, {
        message: `Name must be at least ${VALIDATE.nameMin} characters`,
    }).max(VALIDATE.nameMax, {
        message: `Name must be at most ${VALIDATE.nameMax} characters`,
    }).regex(VALIDATE.regexName, {
        message: "Name must not contain numbers",
    }),
}).refine((data) => data.password === data.confirm_password, {
    message: "ConfirmPassword do not match",
    path: ["confirm_password"],
})

export const loginSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().trim().min(VALIDATE.pwdMin, {
        message: `Password must be at least ${VALIDATE.pwdMin} characters`,
    }).max(VALIDATE.pwdMax, {
        message: `Password must be at most ${VALIDATE.pwdMax} characters`,
    }),
})