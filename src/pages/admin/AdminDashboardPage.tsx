import { Boxes, ClipboardList, MessageCircle, Package, Percent, TrendingUp, UsersRound, WalletCards } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { ChartCard } from '../../components/ChartCard';
import { DashboardCard } from '../../components/DashboardCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';
import { formatCurrency } from '../../utils/format';

export function AdminDashboardPage() {
  const metrics = useAsync(() => dataService.getDashboard(), []);

  if (metrics.loading || !metrics.data) return <LoadingSpinner />;

  const data = metrics.data;
  return (
    <div>
      <PageHeader eyebrow="Dashboard Admin" title="Visão geral da Husky" description="Vendas, pedidos, estoque, matilha e engajamento em um painel só." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <DashboardCard label="Vendas do dia" value={formatCurrency(data.salesToday)} icon={<TrendingUp className="h-5 w-5" />} />
        <DashboardCard label="Pedidos pendentes" value={String(data.pendingOrders)} icon={<ClipboardList className="h-5 w-5" />} />
        <DashboardCard label="Faturamento do mês" value={formatCurrency(data.monthRevenue)} icon={<WalletCards className="h-5 w-5" />} />
        <DashboardCard label="Lucro estimado" value={formatCurrency(data.estimatedProfit)} icon={<TrendingUp className="h-5 w-5" />} />
        <DashboardCard label="Clientes cadastrados" value={String(data.customerCount)} icon={<UsersRound className="h-5 w-5" />} />
        <DashboardCard label="Produtos ativos" value={String(data.activeProducts)} icon={<Package className="h-5 w-5" />} />
        <DashboardCard label="Estoque baixo" value={String(data.lowStock)} icon={<Boxes className="h-5 w-5" />} helper="Atenção: tem ingrediente quase sumindo da cozinha." />
        <DashboardCard label="Comentários pendentes" value={String(data.pendingComments)} icon={<MessageCircle className="h-5 w-5" />} />
        <DashboardCard label="Cupons ativos" value={String(data.activeCoupons)} icon={<Percent className="h-5 w-5" />} />
        <DashboardCard label="Post mais curtido" value={data.topPostTitle} icon={<TrendingUp className="h-5 w-5" />} />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <ChartCard title="Vendas por dia" data={data.salesByDay} />
        <ChartCard title="Produtos mais vendidos" data={data.productsSold} type="bar" />
        <ChartCard title="Faturamento mensal" data={data.revenueByMonth} />
        <ChartCard title="Novos clientes" data={data.customersByWeek} type="bar" />
      </div>
    </div>
  );
}
