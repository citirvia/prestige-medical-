import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

interface StockBadgeProps {
  status: StockStatus;
  quantity?: number;
}

export default function StockBadge({ status, quantity }: StockBadgeProps) {
  return (
    <div className={clsx(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
      {
        'bg-green-100 text-green-700': status === 'in_stock',
        'bg-yellow-100 text-yellow-800': status === 'low_stock',
        'bg-red-100 text-red-700': status === 'out_of_stock',
      }
    )}>
      {status === 'in_stock' && <CheckCircle className="w-4 h-4" />}
      {status === 'low_stock' && <AlertTriangle className="w-4 h-4" />}
      {status === 'out_of_stock' && <XCircle className="w-4 h-4" />}
      
      <span>
        {status === 'in_stock' && 'En Stock'}
        {status === 'low_stock' && `Stock Faible${typeof quantity === 'number' ? ` (${quantity} restants)` : ''}`}
        {status === 'out_of_stock' && 'Rupture'}
      </span>
    </div>
  );
}
