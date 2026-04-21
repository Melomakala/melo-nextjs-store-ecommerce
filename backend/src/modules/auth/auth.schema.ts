import { regex, z } from "zod"


const VALIDATE = {
    pwdMin: 6,
    pwdMax: 20,
    nameMin: 3,
    nameMax: 10,
    regexName: /^[A-Za-zก-ฮ]+$/
}

export const registerSchema = z.object({
    body: z.object({
        email: z.string().trim().email(),
        password: z.string().trim().min(VALIDATE.pwdMin, {
            message: "Password must be at least 6 characters",
        }).max(VALIDATE.pwdMax, {
            message: "Password must be at most 20 characters",
        }),
        confirm_password: z.string().trim().min(VALIDATE.pwdMin, {
            message: "ConfirmPassword must be at least 6 characters",
        }).max(VALIDATE.pwdMax, {
            message: "ConfirmPassword must be at most 20 characters",
        }),
        name: z.string().trim().min(VALIDATE.nameMin, {
            message: "Name must be at least 3 characters",
        }).max(VALIDATE.nameMax, {
            message: "Name must be at most 10 characters",
        }).regex(VALIDATE.regexName, {
            message: "Name must not contain numbers",
        }),
    }).refine((data) => data.password === data.confirm_password, {
        message: "ConfirmPassword do not match",
        path: ["confirm_password"],
    }).transform(({ confirm_password, ...rest }) => rest)
})

export const loginSchema = z.object({
    body: z.object({
        email: z.string().trim().email(),
        password: z.string().trim().min(VALIDATE.pwdMin, {
            message: "Password must be at least 6 characters",
        }).max(VALIDATE.pwdMax, {
            message: "Password must be at most 20 characters",
        }),
    })
})