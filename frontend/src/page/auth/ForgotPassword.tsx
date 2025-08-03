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
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Loader, ArrowLeft, Mail } from "lucide-react";
import { forgotPasswordMutationFn } from "@/lib/api/auth.api";
import { useState } from "react";

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPasswordMutationFn,
    onSuccess: (data) => {
      setEmailSent(true);
      toast({
        title: "Email sent",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send reset email",
        variant: "destructive",
      });
    },
  });

  const formSchema = z.object({
    email: z.string().trim().email("Invalid email address").min(1, {
      message: "Email is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;
    mutate(values);
  };

  if (emailSent) {
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
                We've sent a password reset link to your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                If an account with that email exists, you will receive a password reset link shortly.
              </p>
              <p className="text-center text-sm text-muted-foreground">
                The link will expire in 1 hour for security reasons.
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link to="/">Back to Sign In</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setEmailSent(false)}
                >
                  Send another email
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
            <CardTitle className="text-xl">Reset your password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
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
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full"
                  >
                    {isPending && <Loader className="animate-spin mr-2" />}
                    Send reset email
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/" className="flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Sign In
                    </Link>
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

export default ForgotPassword;
