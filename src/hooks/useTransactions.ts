import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Transaction {
  id: string;
  project_id: string;
  user_id: string;
  description: string;
  amount: number;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export const useTransactions = (projectId: string) => {
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("project_id", projectId)
        .order("transaction_date", { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
  });

  const addTransaction = useMutation({
    mutationFn: async (newTransaction: {
      description: string;
      amount: number;
      transaction_date: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("transactions")
        .insert([{ ...newTransaction, project_id: projectId, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Lançamento adicionado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao adicionar lançamento");
    },
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Lançamento removido!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao remover lançamento");
    },
  });

  return {
    transactions,
    isLoading,
    addTransaction: addTransaction.mutate,
    deleteTransaction: deleteTransaction.mutate,
  };
};
