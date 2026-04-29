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
import { Eye, EyeOff, Mail, Lock, ArrowRight, Store, UserPlus, ShieldX } from "lucide-react";
import { loginSchema } from "@/modules/auth/auth.schema";
import { LoginData } from "@/modules/auth/auth.type";


export default function LoginPage() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState<LoginData>({
        email: "",
        password: "",
    });
    const [stateError, setStateError] = useState<any[]>([]);

    const handleOnchange = (field: keyof LoginData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [field]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setStateError([]);

        const result = loginSchema.safeParse(formData);
        if (!result.success) {
            setTimeout(() => {
                setIsLoading(false)
                setStateError(result.error.issues);
                console.log(result.error.issues);
            }, 2000);
            return;
        }
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[oklch(0.13_0.004_228.8)]">
            {/* Subtle gradient accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-[120px]" />
            <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/3 blur-[100px]" />

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md px-4">
                {/* Logo / Brand */}
                <div className="mb-8 flex flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
                        <Store className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">
                        Melo Store
                    </h1>
                    <p className="text-sm text-white/50">
                        Welcome back, sign in to continue
                    </p>
                </div>

                <Card className="border-white/[0.06] bg-white/[0.03] shadow-2xl shadow-black/30 backdrop-blur-xl">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-xl font-semibold text-white">
                            Sign In
                        </CardTitle>
                        <CardDescription className="text-white/40">
                            Enter your email and password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm text-white/60">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleOnchange("email")}
                                        placeholder="your@email.com"
                                        required
                                        className="h-11 border-white/[0.08] bg-white/[0.04] pl-10 text-white placeholder:text-white/20 focus:border-primary/50 focus:ring-primary/20"
                                    />
                                </div>
                                {stateError.find((error) => error.path[0] === "email") && (
                                    <div className="flex items-center gap-2">
                                        <ShieldX className="h-4 w-4 text-red-500" />
                                        <p className="text-sm text-red-500">
                                            {stateError.find((error) => error.path[0] === "email")?.message}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm text-white/60">
                                        Password
                                    </Label>
                                    <Link
                                        tabIndex={-1}
                                        href="/forgot-password"
                                        className="text-xs text-primary/70 transition-colors hover:text-primary"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleOnchange("password")}
                                        required
                                        className="h-11 border-white/[0.08] bg-white/[0.04] pl-10 pr-10 text-white placeholder:text-white/20 focus:border-primary/50 focus:ring-primary/20"
                                    />
                                    <button
                                        tabIndex={-1}
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 transition-colors hover:text-white/50"
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
                                        <ShieldX className="h-4 w-4 text-red-500" />
                                        <p className="text-sm text-red-500">
                                            {stateError.find((error) => error.path[0] === "password")?.message}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                size="lg"
                                disabled={isLoading}
                                className="h-11 w-full bg-primary text-primary-foreground font-semibold transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                                        <span>Signing in...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span>Sign In</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                )}
                            </Button>

                            {/* Divider */}
                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/[0.06]" />
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="bg-[oklch(0.13_0.004_228.8)] px-3 text-white/25">
                                        or
                                    </span>
                                </div>
                            </div>

                            {/* Register Button */}
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                asChild
                                className="h-11 w-full border-white/[0.08] bg-white/[0.03] text-white/70 transition-all hover:bg-white/[0.06] hover:text-white"
                            >
                                <Link href="/register">
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Create Account
                                </Link>
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-white/20">
                    © 2026 Melo Store. All rights reserved.
                </p>
            </div>
        </div>
    );
}