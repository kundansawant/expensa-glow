import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Wallet, Calendar, PieChart } from "lucide-react";

interface ExpenseStatsProps {
  totalThisMonth: number;
  totalAllTime: number;
  categoryCount: number;
  expenseCount: number;
}

export const ExpenseStats = ({ 
  totalThisMonth, 
  totalAllTime, 
  categoryCount,
  expenseCount 
}: ExpenseStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-[var(--shadow-hover)] transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            ${totalThisMonth.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">Current month spending</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-[var(--shadow-hover)] transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">All Time</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">
            ${totalAllTime.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">Total expenses tracked</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-[var(--shadow-hover)] transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{categoryCount}</div>
          <p className="text-xs text-muted-foreground">Active categories</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-[var(--shadow-hover)] transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{expenseCount}</div>
          <p className="text-xs text-muted-foreground">Recorded transactions</p>
        </CardContent>
      </Card>
    </div>
  );
};
