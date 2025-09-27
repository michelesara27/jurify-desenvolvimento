import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, Bell } from "lucide-react";

export const Header = () => {
  return (
    <header className="flex h-16 items-center justify-between px-6 border-b border-border bg-card">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Última atualização: {new Date().toLocaleString('pt-BR')}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">
              DJ
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">Dr. João</p>
            <p className="text-muted-foreground">Advogado</p>
          </div>
        </div>
      </div>
    </header>
  );
};
