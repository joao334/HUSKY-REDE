import { Download, FileText } from 'lucide-react';
import { PageHeader } from '../../components/PageHeader';
import { ChartCard } from '../../components/ChartCard';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';
import { formatCurrency } from '../../utils/format';

export function AdminReportsPage() {
  const metrics = useAsync(() => dataService.getDashboard(), []);

  function exportCsv() {
    if (!metrics.data) return;
    const rows = [
      ['Relatório', 'Valor'],
      ['Faturamento do mês', metrics.data.monthRevenue],
      ['Lucro estimado', metrics.data.estimatedProfit],
      ['Pedidos pendentes', metrics.data.pendingOrders],
      ['Clientes cadastrados', metrics.data.customerCount],
      ['Produtos ativos', metrics.data.activeProducts],
      ['Estoque baixo', metrics.data.lowStock],
    ];
    const csv = rows.map((row) => row.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'husky-club-relatorio.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  if (metrics.loading || !metrics.data) return <LoadingSpinner />;
  const data = metrics.data;

  return (
    <div>
      <PageHeader
        eyebrow="Relatórios"
        title="Resultados da confeitaria"
        description="Vendas, lucro estimado, produtos, clientes, cupons, estoque, despesas e engajamento."
        action={
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={<FileText className="h-4 w-4" />} onClick={() => window.print()}>
              Exportar PDF
            </Button>
            <Button leftIcon={<Download className="h-4 w-4" />} onClick={exportCsv}>
              Exportar CSV
            </Button>
          </div>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5"><p className="text-sm font-bold text-husky-brown/60">Faturamento</p><p className="mt-2 text-3xl font-black">{formatCurrency(data.monthRevenue)}</p></Card>
        <Card className="p-5"><p className="text-sm font-bold text-husky-brown/60">Lucro estimado</p><p className="mt-2 text-3xl font-black">{formatCurrency(data.estimatedProfit)}</p></Card>
        <Card className="p-5"><p className="text-sm font-bold text-husky-brown/60">Crescimento da matilha</p><p className="mt-2 text-3xl font-black">{data.customerCount}</p></Card>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <ChartCard title="Vendas por dia" data={data.salesByDay} />
        <ChartCard title="Produtos mais vendidos" data={data.productsSold} type="bar" />
        <ChartCard title="Faturamento mensal" data={data.revenueByMonth} />
        <ChartCard title="Pedidos por status" data={data.ordersByStatus} type="bar" />
      </div>
    </div>
  );
}
