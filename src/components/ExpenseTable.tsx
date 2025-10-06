import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { categoryColors } from "@/lib/categoryColors";
import { EditExpenseDialog } from "./EditExpenseDialog";

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  note: string | null;
}

interface ExpenseTableProps {
  expenses: Expense[];
  onExpenseUpdated: () => void;
}

export const ExpenseTable = ({ expenses, onExpenseUpdated }: ExpenseTableProps) => {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
      
      toast.success("Expense deleted successfully!");
      onExpenseUpdated();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete expense");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Note</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No expenses yet. Add your first expense to get started!
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {format(new Date(expense.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      style={{ 
                        backgroundColor: categoryColors[expense.category as keyof typeof categoryColors],
                        color: "white"
                      }}
                    >
                      {expense.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    ${expense.amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {expense.note || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingExpense(expense)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(expense.id)}
                        disabled={deleting === expense.id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingExpense && (
        <EditExpenseDialog
          expense={editingExpense}
          open={!!editingExpense}
          onOpenChange={(open) => !open && setEditingExpense(null)}
          onExpenseUpdated={() => {
            setEditingExpense(null);
            onExpenseUpdated();
          }}
        />
      )}
    </>
  );
};
