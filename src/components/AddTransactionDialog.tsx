import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil } from "lucide-react";
import { Transaction } from "@/hooks/useTransactions";

interface AddTransactionDialogProps {
  onAddTransaction?: (transaction: {
    description: string;
    amount: number;
    transaction_date: string;
  }) => void;
  onUpdateTransaction?: (id: string, updates: {
    description: string;
    amount: number;
    transaction_date: string;
  }) => void;
  transaction?: Transaction;
  trigger?: React.ReactNode;
}

export const AddTransactionDialog = ({ 
  onAddTransaction, 
  onUpdateTransaction, 
  transaction,
  trigger 
}: AddTransactionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    transaction_date: new Date().toISOString().split('T')[0],
  });

  const isEditMode = !!transaction;

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        transaction_date: transaction.transaction_date,
      });
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && transaction && onUpdateTransaction) {
      onUpdateTransaction(transaction.id, {
        description: formData.description,
        amount: Number(formData.amount),
        transaction_date: formData.transaction_date,
      });
    } else if (onAddTransaction) {
      onAddTransaction({
        description: formData.description,
        amount: Number(formData.amount),
        transaction_date: formData.transaction_date,
      });
    }
    
    setFormData({
      description: "",
      amount: "",
      transaction_date: new Date().toISOString().split('T')[0],
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Lançamento
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Editar Lançamento" : "Novo Lançamento"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Hospedagem do site"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transaction_date">Data</Label>
            <Input
              id="transaction_date"
              type="date"
              required
              value={formData.transaction_date}
              onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full">
            {isEditMode ? "Salvar Alterações" : "Adicionar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
