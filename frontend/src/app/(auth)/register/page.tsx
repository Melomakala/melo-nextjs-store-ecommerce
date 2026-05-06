"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Store, User, LogIn, ShieldX } from "lucide-react";
import { RegisterData } from "@/modules/auth/auth.type";
import { useRegister } from "@/modules/auth/auth.hook";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerSchema } from "@/modules/auth/auth.schema"


export default function RegisterPage() {

    const router = useRouter();
    const { handleRegister } = useRegister();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formData, setformData] = useState<RegisterData>({
        email: "",
        password: "",
        confirm_password: "",
        name: "",
    });
    const [stateError, setStateError] = useState<any[]>([]);


    const handleOnchange = (field: keyof RegisterData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setformData({
            ...formData,
            [field]: e.target.value,
        });
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStateError([]);

        const result = registerSchema.safeParse(formData);
        if (!result.success) {
            setStateError(result.error.issues);
            setIsSubmitting(false)
            return;
        }
        try {
            const response = await handleRegister(formData);
            if (response) {
                toast.success("Account created successfully!",
                    { position: "bottom-center" });
                router.push("/login");
            }
        } catch (error: any) {
            toast(<div className="flex items-center gap-2">
                <ShieldX className="h-4 w-4 text-red-500" />
                <p className="text-red-500 text-sm">{error.message || "Something went wrong"}</p>
            </div>,
                { position: "bottom-center" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
            {/* Subtle gradient accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/3 blur-[100px]" />

            {/* Register Card */}
            <div className="relative z-10 w-full max-w-md px-4">
                {/* Logo / Brand */}
                <div className="mb-8 flex flex-col items-center gap-3">
                    <Link href="/">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
                            <Store className="h-7 w-7 text-primary-foreground" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Melo Store
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Create your account to get started
                    </p>
                </div>

                <Card className="border-border bg-card/50 shadow-2xl backdrop-blur-xl">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl font-semibold text-foreground">
                            Create Account
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Fill in your details to register
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm text-muted-foreground">
                                    Username
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Username"
                                        value={formData.name}
                                        onChange={handleOnchange("name")}
                                        required
                                        className="h-11 border-input bg-background pl-10 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
                                    />
                                </div>
                                {stateError.find((error) => error.path[0] === "name") && (
                                    <div className="flex items-center gap-2">
                                        <ShieldX className="h-4 w-4 text-destructive" />
                                        <p className="text-sm text-destructive">
                                            {stateError.find((error) => error.path[0] === "name")?.message}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm text-muted-foreground">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleOnchange("email")}
                                        required
                                        className="h-11 border-input bg-background pl-10 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
                                    />
                                </div>
                                {stateError.find((error) => error.path[0] === "email") && (
                                    <div className="flex items-center gap-2">
                                        <ShieldX className="h-4 w-4 text-destructive" />
                                        <p className="text-sm text-destructive">
                                            {stateError.find((error) => error.path[0] === "email")?.message}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm text-muted-foreground">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleOnchange("password")}
                                        required
                                        className="h-11 border-input bg-background pl-10 pr-10 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
                                    />
                                    <button
                                        tabIndex={-1}
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-foreground"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {stateError.find((error) => error.path[0] === "password") && (
                                    <div className="flex items-center gap-2">
                                        <ShieldX className="h-4 w-4 text-destructive" />
                                        <p className="text-sm text-destructive">
                                            {stateError.find((error) => error.path[0] === "password")?.message}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.confirm_password}
                                        onChange={handleOnchange("confirm_password")}
                                        required
                                        className="h-11 border-input bg-background pl-10 pr-10 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
                                    />
                                    <button
                                        tabIndex={-1}
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-foreground"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {stateError.find((error) => error.path[0] === "confirm_password") && (
                                    <div className="flex items-center gap-2">
                                        <ShieldX className="h-4 w-4 text-destructive" />
                                        <p className="text-sm text-destructive">
                                            {stateError.find((error) => error.path[0] === "confirm_password")?.message}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isSubmitting}
                                className="h-11 w-full bg-primary text-primary-foreground font-semibold transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                                        <span>Creating account...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span>Create Account</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                )}
                            </Button>

                            {/* Divider */}
                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="bg-card px-3 text-muted-foreground">
                                        or
                                    </span>
                                </div>
                            </div>

                            {/* Sign In Button */}
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                asChild
                                className="h-11 w-full border-input bg-card/50 text-foreground transition-all hover:bg-accent hover:text-accent-foreground"
                            >
                                <Link href="/login">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Sign In
                                </Link>
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-muted-foreground">
                    © 2026 Melo Store. All rights reserved.
                </p>
            </div>
        </div>
    );
}
