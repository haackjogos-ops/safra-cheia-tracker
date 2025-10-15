import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { AddProjectDialog } from "@/components/AddProjectDialog";
import { AuthForm } from "@/components/AuthForm";
import { ProjectDetails } from "@/components/ProjectDetails";
import { useProjects, Project } from "@/hooks/useProjects";
import { supabase } from "@/integrations/supabase/client";
import { Sprout, BarChart3, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { projects, isLoading, addProject, updateProject, deleteProject } = useProjects();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso!");
  };

  if (!user) {
    return <AuthForm />;
  }

  const totalInvestmentGoal = projects.reduce((sum, p) => sum + Number(p.investment_goal), 0);
  const totalSpent = projects.reduce((sum, p) => sum + Number(p.spent), 0);
  const totalBudget = projects.reduce((sum, p) => sum + Number(p.initial_budget), 0);
  const totalRemaining = totalBudget - totalSpent;
  const averageProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-foreground/10 p-2 rounded-lg">
                <Sprout className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Safra Cheia</h1>
                <p className="text-sm text-primary-foreground/80">Gestão de Projetos</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-card p-4 rounded-xl shadow-md border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs font-medium">Progresso Médio</span>
            </div>
            <p className="text-2xl font-bold text-primary">{averageProgress}%</p>
          </div>
          
          <div className="bg-card p-4 rounded-xl shadow-md border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs font-medium">Total Gasto</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              R$ {totalSpent.toLocaleString('pt-BR')}
            </p>
          </div>

          <div className="bg-card p-4 rounded-xl shadow-md border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs font-medium">Saldo Total</span>
            </div>
            <p className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-success' : 'text-destructive'}`}>
              R$ {Math.abs(totalRemaining).toLocaleString('pt-BR')}
            </p>
          </div>

          <div className="bg-card p-4 rounded-xl shadow-md border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs font-medium">Meta Total</span>
            </div>
            <p className="text-2xl font-bold text-accent">
              R$ {totalInvestmentGoal.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4 pb-24">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">
              Projetos ({projects.length})
            </h2>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando projetos...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <Sprout className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                Nenhum projeto ainda. Adicione seu primeiro projeto!
              </p>
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard 
                key={project.id} 
                {...project}
                onDelete={deleteProject}
                onOpenDetails={() => {
                  setSelectedProject(project);
                  setDetailsOpen(true);
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <AddProjectDialog onAddProject={addProject} />

      {/* Project Details Sheet */}
      <ProjectDetails 
        project={selectedProject}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onUpdateProject={(id, updates) => updateProject({ id, updates })}
      />
    </div>
  );
};

export default Index;
