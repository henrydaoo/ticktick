import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, CheckCircle, XCircle, Mail } from "lucide-react";
import Logo from "@/components/logo";
import { verifyEmailMutationFn } from "@/lib/api/auth.api";
import { toast } from "@/hooks/use-toast";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const { mutate: verifyEmail } = useMutation({
    mutationFn: verifyEmailMutationFn,
    onSuccess: (data) => {
      setStatus("success");
      toast({
        title: "Success",
        description: data.message,
      });
      setTimeout(() => {
        navigate("/sign-in");
      }, 3000);
    },
    onError: (error: any) => {
      setStatus("error");
      toast({
        title: "Error",
        description: error.response?.data?.message || "Verification failed",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus("error");
    }
  }, [token, verifyEmail]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <>
            <div className="flex items-center justify-center mb-4">
              <Loader className="h-12 w-12 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">
              Verifying your email...
            </h2>
            <p className="text-center text-muted-foreground">
              Please wait while we verify your email address.
            </p>
          </>
        );
      
      case "success":
        return (
          <>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">
              Email verified successfully!
            </h2>
            <p className="text-center text-muted-foreground mb-4">
              Your email has been verified. You can now sign in to your account.
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Redirecting to sign in page in 3 seconds...
            </p>
            <div className="mt-4">
              <Button asChild className="w-full">
                <Link to="/sign-in">Go to Sign In</Link>
              </Button>
            </div>
          </>
        );
      
      case "error":
        return (
          <>
            <div className="flex items-center justify-center mb-4">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">
              Verification failed
            </h2>
            <p className="text-center text-muted-foreground mb-4">
              The verification link is invalid or has expired. Please request a new verification email.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link to="/sign-up">Create New Account</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/sign-in">Back to Sign In</Link>
              </Button>
            </div>
          </>
        );
    }
  };

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
              <Mail className="h-5 w-5" />
              Email Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
