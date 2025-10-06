import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ExpenseStats } from "@/components/ExpenseStats";
import { AddExpenseDialog } from "@/components/AddExpenseDialog";
import { ExpenseTable } from "@/components/ExpenseTable";
import { ExpenseCharts } from "@/components/ExpenseCharts";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  note: string | null;
}

const Index = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        fetchExpenses();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  
  const totalThisMonth = expenses
    .filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    })
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalAllTime = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  
  const categories = [...new Set(expenses.map(e => e.category))];
  const categoryCount = categories.length;

  // Category data for pie chart
  const categoryData = categories.map(cat => ({
    name: cat,
    value: expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + Number(e.amount), 0),
  }));

  // Monthly data for line chart (last 6 months)
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const monthDate = subMonths(now, 5 - i);
    const monthStartDate = startOfMonth(monthDate);
    const monthEndDate = endOfMonth(monthDate);
    
    const amount = expenses
      .filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate >= monthStartDate && expenseDate <= monthEndDate;
      })
      .reduce((sum, e) => sum + Number(e.amount), 0);

    return {
      month: format(monthDate, "MMM"),
      amount,
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground mt-1">
              Track and manage your expenses
            </p>
          </div>
          <AddExpenseDialog onExpenseAdded={fetchExpenses} />
        </div>

        <ExpenseStats
          totalThisMonth={totalThisMonth}
          totalAllTime={totalAllTime}
          categoryCount={categoryCount}
          expenseCount={expenses.length}
        />

        <ExpenseCharts categoryData={categoryData} monthlyData={monthlyData} />

        <div>
          <h3 className="text-2xl font-semibold mb-4">Recent Expenses</h3>
          <ExpenseTable expenses={expenses} onExpenseUpdated={fetchExpenses} />
        </div>
      </main>
    </div>
  );
};

export default Index;
