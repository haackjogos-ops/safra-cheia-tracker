-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
ON public.transactions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
ON public.transactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update project spent amount
CREATE OR REPLACE FUNCTION public.update_project_spent()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the spent amount in projects table
  UPDATE public.projects
  SET spent = (
    SELECT COALESCE(SUM(amount), 0)
    FROM public.transactions
    WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
  )
  WHERE id = COALESCE(NEW.project_id, OLD.project_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers to update project spent on transaction changes
CREATE TRIGGER update_project_spent_on_insert
AFTER INSERT ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_project_spent();

CREATE TRIGGER update_project_spent_on_update
AFTER UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_project_spent();

CREATE TRIGGER update_project_spent_on_delete
AFTER DELETE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_project_spent();