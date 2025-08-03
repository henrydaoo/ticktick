import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader, Mail, CheckCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { resendVerificationMutationFn } from "@/lib/api/auth.api";
import { toast } from "@/hooks/use-toast";

interface ResendVerificationCardProps {
  defaultEmail?: string;
  onSuccess?: () => void;
}

const ResendVerificationCard = ({ defaultEmail = "", onSuccess }: ResendVerificationCardProps) => {
  const [email, setEmail] = useState(defaultEmail);
  const [emailSent, setEmailSent] = useState(false);

  const { mutate: resendVerification, isPending } = useMutation({
    mutationFn: resendVerificationMutationFn,
    onSuccess: (data) => {
      setEmailSent(true);
      toast({
        title: "Email sent",
        description: data.message,
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to resend email",
        variant: "destructive",
      });
    },
  });

  const handleResend = () => {
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    resendVerification({ email });
  };

  if (emailSent) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-lg flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Verification email sent
          </CardTitle>
          <CardDescription>
            Please check your email and click the verification link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => setEmailSent(false)} 
            variant="outline" 
            className="w-full"
          >
            Send another email
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-lg flex items-center justify-center gap-2">
          <Mail className="h-5 w-5" />
          Resend verification email
        </CardTitle>
        <CardDescription>
          Enter your email address to receive a new verification link
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="!h-[48px]"
          />
        </div>
        <Button 
          onClick={handleResend}
          disabled={isPending || !email.trim()}
          className="w-full"
        >
          {isPending && <Loader className="animate-spin mr-2" />}
          Send verification email
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResendVerificationCard;
