import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface ProjectFormData {
  name: string;
  budget: string;
  spent: string;
  progress: string;
  deadline: string;
  url: string;
}

interface AddProjectDialogProps {
  onAddProject: (project: {
    name: string;
    budget: number;
    spent: number;
    progress: number;
    deadline: string;
    url?: string;
  }) => void;
}

export const AddProjectDialog = ({ onAddProject }: AddProjectDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    budget: "",
    spent: "",
    progress: "",
    deadline: "",
    url: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.budget || !formData.spent || !formData.progress || !formData.deadline) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const progress = parseFloat(formData.progress);
    if (progress < 0 || progress > 100) {
      toast.error("Progresso deve estar entre 0 e 100");
      return;
    }

    onAddProject({
      name: formData.name,
      budget: parseFloat(formData.budget),
      spent: parseFloat(formData.spent),
      progress,
      deadline: formData.deadline,
      url: formData.url || undefined,
    });

    toast.success("Projeto adicionado com sucesso!");
    setFormData({
      name: "",
      budget: "",
      spent: "",
      progress: "",
      deadline: "",
      url: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Projeto</DialogTitle>
          <DialogDescription>
            Adicione as informações do seu projeto de site
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Projeto *</Label>
            <Input
              id="name"
              placeholder="Ex: Site E-commerce"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL (opcional)</Label>
            <Input
              id="url"
              placeholder="https://exemplo.com"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Orçamento (R$) *</Label>
              <Input
                id="budget"
                type="number"
                placeholder="10000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="spent">Gasto (R$) *</Label>
              <Input
                id="spent"
                type="number"
                placeholder="5000"
                value={formData.spent}
                onChange={(e) => setFormData({ ...formData, spent: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="progress">Progresso (%) *</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                placeholder="50"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Prazo *</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Adicionar Projeto
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
