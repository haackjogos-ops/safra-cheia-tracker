import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Calendar, Globe } from "lucide-react";

interface ProjectCardProps {
  id: string;
  name: string;
  progress: number;
  budget: number;
  spent: number;
  deadline: string;
  url?: string;
}

export const ProjectCard = ({
  name,
  progress,
  budget,
  spent,
  deadline,
  url,
}: ProjectCardProps) => {
  const remaining = budget - spent;
  const budgetPercentage = (spent / budget) * 100;
  const isOverBudget = spent > budget;
  
  const getProgressColor = () => {
    if (progress >= 75) return "text-success";
    if (progress >= 50) return "text-warning";
    return "text-info";
  };

  const getBudgetColor = () => {
    if (isOverBudget) return "text-destructive";
    if (budgetPercentage > 80) return "text-warning";
    return "text-success";
  };

  return (
    <Card className="p-5 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-secondary/30 border-border/50">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-foreground line-clamp-2">{name}</h3>
            {url && (
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-1"
              >
                <Globe className="h-3 w-3" />
                {url}
              </a>
            )}
          </div>
          <Badge 
            variant={progress >= 75 ? "default" : "secondary"}
            className="shrink-0"
          >
            {progress}%
          </Badge>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Progresso
            </span>
            <span className={`font-semibold ${getProgressColor()}`}>
              {progress}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Budget Section */}
        <div className="space-y-2 p-3 rounded-lg bg-secondary/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Orçamento
            </span>
            <span className="font-semibold text-foreground">
              R$ {budget.toLocaleString('pt-BR')}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Gasto</span>
            <span className={`font-semibold ${getBudgetColor()}`}>
              R$ {spent.toLocaleString('pt-BR')}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
            <span className="text-muted-foreground">Restante</span>
            <span className={`font-bold ${remaining >= 0 ? 'text-success' : 'text-destructive'}`}>
              R$ {Math.abs(remaining).toLocaleString('pt-BR')}
              {remaining < 0 && ' (excedido)'}
            </span>
          </div>
        </div>

        {/* Deadline */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Prazo: {new Date(deadline).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
    </Card>
  );
};
