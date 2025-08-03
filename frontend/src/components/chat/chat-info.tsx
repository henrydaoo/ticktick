import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Users, MessageSquare, Hash } from "lucide-react";

export const ChatInfo = () => {
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Chat Features
          </CardTitle>
          <CardDescription>
            Learn about the available chat features in your workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <Hash className="h-4 w-4 mt-0.5 text-green-500" />
            <div>
              <p className="font-medium text-sm">Workspace Channels</p>
              <p className="text-xs text-muted-foreground">
                Automatically created workspace channels (owner/admin feature)
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MessageSquare className="h-4 w-4 mt-0.5 text-blue-500" />
            <div>
              <p className="font-medium text-sm">Personal Notes</p>
              <p className="text-xs text-muted-foreground">
                Chat with yourself to save notes and reminders
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Users className="h-4 w-4 mt-0.5 text-purple-500" />
            <div>
              <p className="font-medium text-sm">Join Channels</p>
              <p className="text-xs text-muted-foreground">
                Click "Join Workspace Channel" to participate in team discussions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
