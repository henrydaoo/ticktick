import { Link } from "react-router-dom";
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
import GoogleOauthButton from "@/components/auth/google-oauth-button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Loader, Mail, CheckCircle } from "lucide-react";
import { registerMutationFn, resendVerificationMutationFn } from "@/lib/api/auth.api";
import { useState } from "react";

const SignUp = () => {
  const [registrationEmail, setRegistrationEmail] = useState<string>("");
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: registerMutationFn,
    onSuccess: (data) => {
      setRegistrationEmail(form.getValues().email);
      setShowVerificationMessage(true);
      toast({
        title: "Account created successfully",
        description: data.message,
      });
    },
    onError: (error: any) => {
      console.log(error);
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: resendVerification, isPending: isResending } = useMutation({
    mutationFn: resendVerificationMutationFn,
    onSuccess: (data) => {
      toast({
        title: "Email sent",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to resend email",
        variant: "destructive",
      });
    },
  });
  const formSchema = z.object({
    name: z.string().trim().min(1, {
      message: "Name is required",
    }),
    email: z.string().trim().email("Invalid email address").min(1, {
      message: "Email is required",
    }),
    password: z.string().trim().min(6, {
      message: "Password must be at least 6 characters long",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;
    mutate(values);
  };

  // Show verification message after successful registration
  if (showVerificationMessage) {
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
                <Mail className="h-5 w-5 text-green-600" />
                Check your email
              </CardTitle>
              <CardDescription>
                We've sent a verification link to {registrationEmail}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-sm text-green-800 dark:text-green-400">
                  Account created successfully!
                </p>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Please check your email and click the verification link to activate your account.
              </p>
              <p className="text-center text-sm text-muted-foreground">
                The verification link will expire in 24 hours.
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => resendVerification({ email: registrationEmail })}
                  disabled={isResending}
                  variant="outline"
                  className="w-full"
                >
                  {isResending && <Loader className="animate-spin mr-2" />}
                  Resend verification email
                </Button>
                <Button asChild className="w-full">
                  <Link to="/">Go to Sign In</Link>
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
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Create your account</CardTitle>
              <CardDescription>
                Join TickTick and start managing projects with your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid gap-6">
                    <div className="flex flex-col gap-4">
                      <GoogleOauthButton label="Signup" />
                    </div>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Or continue with
                      </span>
                    </div>
                    <div className="grid gap-2">
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Joh Doe"
                                  className="!h-[48px]"
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="m@example.com"
                                  className="!h-[48px]"
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                Password
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  className="!h-[48px]"
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full"
                      >
                        {isPending && <Loader className="animate-spin" />}
                        Sign up
                      </Button>
                    </div>
                    <div className="text-center text-sm">
                      Already have an account?{" "}
                      <Link to="/" className="underline underline-offset-4">
                        Sign in
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
