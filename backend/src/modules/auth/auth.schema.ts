import { z } from "zod"

const pwdLength: number = 6
const regexName: RegExp = /^[A-Za-zก-ฮ]+$/

export const registerSchema = z.object({
    body: z.object({
        email: z.string().trim().email(),
        password: z.string().trim().min(pwdLength),
        confirm_password: z.string().trim().min(pwdLength),
        name: z.string().trim().min(3).regex(regexName, {
            message: "Name must not contain numbers",
        }),
    }).refine((data) => data.password === data.confirm_password, {
        message: "ConfirmPassword do not match",
        path: ["confirm_password"],
    }).transform(({ confirm_password, ...rest }) => rest)
})