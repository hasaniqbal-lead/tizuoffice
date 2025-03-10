
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMediaQuery } from "@/hooks/use-mobile";

type CollaboratorProps = {
  users: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  limit?: number;
};

export function CollaboratorAvatars({ users, limit = 5 }: CollaboratorProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Limit the number of avatars shown
  const displayUsers = users.slice(0, limit);
  const remaining = users.length - limit;
  
  if (users.length === 0) {
    return null;
  }
  
  return (
    <div className="flex -space-x-2 rtl:space-x-reverse">
      {displayUsers.map((user) => (
        <Tooltip key={user.id}>
          <TooltipTrigger>
            <Avatar className="border-2 border-background w-8 h-8">
              <AvatarFallback style={{ backgroundColor: user.color }}>
                {user.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{user.name}</p>
          </TooltipContent>
        </Tooltip>
      ))}
      
      {remaining > 0 && (
        <Avatar className="border-2 border-background w-8 h-8">
          <AvatarFallback className="bg-muted text-muted-foreground">
            +{remaining}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
