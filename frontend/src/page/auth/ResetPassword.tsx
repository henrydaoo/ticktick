import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Logo from "@/components/logo";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Loader, CheckCircle, XCircle, Lock } from "lucide-react";
import { resetPasswordMutationFn } from "@/lib/api/auth.api";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [isValidToken, setIsValidToken] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: resetPasswordMutationFn,
    onSuccess: (data) => {
      setResetSuccess(true);
      toast({
        title: "Success",
        description: data.message,
      });
      setTimeout(() => {
        navigate("/");
      }, 3000);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Failed to reset password";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      if (
        errorMessage.includes("Invalid") ||
        errorMessage.includes("expired")
      ) {
        setIsValidToken(false);
      }
    },
  });

  const formSchema = z
    .object({
      password: z.string().trim().min(6, {
        message: "Password must be at least 6 characters long",
      }),
      confirmPassword: z.string().trim().min(1, {
        message: "Please confirm your password",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
    }
  }, [token]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending || !token) return;
    mutate({
      token,
      password: values.password,
    });
  };

  if (resetSuccess) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 self-center font-medium"
          >
            <Logo />
            TickTick
          </Link>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Password Reset Successfully
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Your password has been reset successfully. You can now sign in
                with your new password.
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Redirecting to sign in page in 3 seconds...
              </p>
              <Button asChild className="w-full">
                <Link to="/">Go to Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isValidToken || !token) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 self-center font-medium"
          >
            <Logo />
            TickTick
          </Link>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl flex items-center justify-center gap-2">
                <XCircle className="h-5 w-5 text-destructive" />
                Invalid Reset Link
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                This password reset link is invalid or has expired. Please
                request a new password reset.
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link to="/forgot-password">Request New Reset Link</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/">Back to Sign In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo />
          TickTick
        </Link>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <Lock className="h-5 w-5" />
              Reset Your Password
            </CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                  <div className="grid gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                            New Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter new password"
                              className="!h-[48px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm new password"
                              className="!h-[48px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending && <Loader className="animate-spin mr-2" />}
                    Reset Password
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/">Back to Sign In</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
