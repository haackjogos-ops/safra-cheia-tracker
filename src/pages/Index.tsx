import { useState } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { AddProjectDialog } from "@/components/AddProjectDialog";
import { Sprout, BarChart3 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  progress: number;
  budget: number;
  spent: number;
  deadline: string;
  url?: string;
}

const Index = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Portal E-commerce Completo",
      progress: 75,
      budget: 25000,
      spent: 18500,
      deadline: "2025-12-31",
      url: "https://exemplo-ecommerce.com",
    },
    {
      id: "2",
      name: "Landing Page Institucional",
      progress: 40,
      budget: 8000,
      spent: 3200,
      deadline: "2025-11-15",
    },
    {
      id: "3",
      name: "Sistema de Gestão Interno",
      progress: 90,
      budget: 45000,
      spent: 42000,
      deadline: "2025-10-30",
      url: "https://sistema-interno.com",
    },
  ]);

  const handleAddProject = (projectData: Omit<Project, "id">) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
    };
    setProjects([newProject, ...projects]);
  };

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const averageProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary-foreground/10 p-2 rounded-lg">
              <Sprout className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Safra Cheia</h1>
              <p className="text-sm text-primary-foreground/80">Gestão de Projetos</p>
            </div>
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
              <span className="text-xs font-medium">Total Investido</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              R$ {totalSpent.toLocaleString('pt-BR')}
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
          
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <Sprout className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                Nenhum projeto ainda. Adicione seu primeiro projeto!
              </p>
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <AddProjectDialog onAddProject={handleAddProject} />
    </div>
  );
};

export default Index;
