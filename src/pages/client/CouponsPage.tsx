import { PageHeader } from '../../components/PageHeader';
import { CouponCard } from '../../components/CouponCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAsync } from '../../hooks/useAsync';
import { dataService } from '../../services/dataService';

export function CouponsPage() {
  const coupons = useAsync(() => dataService.getCoupons(), []);

  return (
    <div>
      <PageHeader eyebrow="Achadinhos da Husky" title="Cupons disponíveis" description="Copie um cupom e use no carrinho." />
      {coupons.loading ? (
        <LoadingSpinner />
      ) : coupons.data?.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {coupons.data.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} />
          ))}
        </div>
      ) : (
        <EmptyState title="Sem cupons agora" description="A Husky logo solta um achadinho novo." />
      )}
    </div>
  );
}
