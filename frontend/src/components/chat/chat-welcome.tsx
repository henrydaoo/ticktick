import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Users, Hash, HelpCircle } from "lucide-react";

interface ChatWelcomeProps {
  onJoinWorkspace: () => void;
  workspaceName?: string;
}

export const ChatWelcome: React.FC<ChatWelcomeProps> = ({ 
  onJoinWorkspace, 
  workspaceName = "workspace" 
}) => {
  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <MessageCircle className="mx-auto h-16 w-16 text-muted-foreground" />
          <h1 className="text-3xl font-bold">Welcome to Chat</h1>
          <p className="text-lg text-muted-foreground">
            Connect with your team and collaborate in real-time
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Workspace Channel
              </CardTitle>
              <CardDescription>
                Join the main {workspaceName} channel to chat with all team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={onJoinWorkspace} className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Join Workspace Channel
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Personal Notes
              </CardTitle>
              <CardDescription>
                Use your personal channel to save notes and reminders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Your personal channel has been automatically created for you
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm space-y-1">
              <p>• <strong>Join channels:</strong> Click the "Join Workspace Channel" button to participate in team discussions</p>
              <p>• <strong>Personal notes:</strong> Use your personal channel to save important information</p>
              <p>• <strong>Real-time messaging:</strong> All messages are synced in real-time across devices</p>
              <p>• <strong>Search:</strong> Use the search feature to find channels and conversations</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
