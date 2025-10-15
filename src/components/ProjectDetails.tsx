import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { AddTransactionDialog } from "./AddTransactionDialog";
import { useTransactions } from "@/hooks/useTransactions";
import { Project } from "@/hooks/useProjects";
import { Trash2, Calendar, DollarSign, TrendingUp, Target, Globe, Pencil } from "lucide-react";

interface ProjectDetailsProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateProject: (id: string, updates: Partial<Project>) => void;
}

export const ProjectDetails = ({ project, open, onOpenChange, onUpdateProject }: ProjectDetailsProps) => {
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const { transactions, isLoading, addTransaction, updateTransaction, deleteTransaction } = useTransactions(project?.id || '');
  
  if (!project) return null;
  
  const remainingBudget = project.initial_budget - project.spent;
  const budgetPercentage = (project.spent / project.initial_budget) * 100;
  const goalPercentage = (project.spent / project.investment_goal) * 100;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">{project.name}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Project Info */}
          <div className="space-y-4">
            {project.url && (
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                {project.url}
              </a>
            )}

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Prazo: {new Date(project.deadline).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-3 p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Progresso
              </span>
              <Badge variant={project.progress >= 75 ? "default" : "secondary"}>
                {project.progress}%
              </Badge>
            </div>
            <Progress value={project.progress} className="h-2" />
            <div className="pt-2">
              <Slider
                value={[project.progress]}
                onValueCommit={(value) => {
                  onUpdateProject(project.id, { progress: value[0] });
                }}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Investment Goal */}
          <div className="space-y-2 p-4 rounded-lg bg-accent/10 border border-accent/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                Meta de Investimento
              </span>
              <span className="font-bold text-accent">
                R$ {project.investment_goal.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {goalPercentage.toFixed(1)}% da meta atingida
            </div>
          </div>

          {/* Budget Overview */}
          <div className="space-y-3 p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pré-Orçamento
              </span>
              <span className="font-semibold">
                R$ {project.initial_budget.toLocaleString('pt-BR')}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Gasto Total</span>
              <span className="font-semibold text-primary">
                R$ {project.spent.toLocaleString('pt-BR')}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm pt-2 border-t border-border/50">
              <span className="text-muted-foreground">Saldo Restante</span>
              <span className={`font-bold ${remainingBudget >= 0 ? 'text-success' : 'text-destructive'}`}>
                R$ {Math.abs(remainingBudget).toLocaleString('pt-BR')}
                {remainingBudget < 0 && ' (excedido)'}
              </span>
            </div>
          </div>

          {/* Add Transaction Button */}
          <AddTransactionDialog onAddTransaction={addTransaction} />

          {/* Transactions List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Lançamentos</h3>
            
            {isLoading ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Carregando lançamentos...
              </p>
            ) : transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum lançamento ainda
              </p>
            ) : (
              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.transaction_date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        R$ {Number(transaction.amount).toLocaleString('pt-BR')}
                      </span>
                      <AddTransactionDialog
                        transaction={transaction}
                        onUpdateTransaction={(id, updates) => updateTransaction({ id, updates })}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTransaction(transaction.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
