import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Project {
  id: string;
  user_id: string;
  name: string;
  url?: string;
  investment_goal: number;
  initial_budget: number;
  spent: number;
  progress: number;
  deadline: string;
  created_at: string;
  updated_at: string;
}

export const useProjects = () => {
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
  });

  const addProject = useMutation({
    mutationFn: async (newProject: {
      name: string;
      url?: string;
      investment_goal: number;
      initial_budget: number;
      spent: number;
      progress: number;
      deadline: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("projects")
        .insert([{ ...newProject, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projeto adicionado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao adicionar projeto");
    },
  });

  const updateProject = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Project>;
    }) => {
      const { data, error } = await supabase
        .from("projects")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projeto atualizado!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar projeto");
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Projeto removido!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao remover projeto");
    },
  });

  return {
    projects,
    isLoading,
    addProject: addProject.mutate,
    updateProject: updateProject.mutate,
    deleteProject: deleteProject.mutate,
  };
};
