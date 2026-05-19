import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProductSkeleton({ count = 1 }) {
  return Array(count).fill(0).map((_, i) => (
    <article key={i} className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-soft">
      <div className="aspect-[4/3]">
        <Skeleton height="100%" borderRadius={0} />
      </div>
      <div className="space-y-3 p-5">
        <div>
          <Skeleton width="40%" height={14} className="mb-2" />
          <Skeleton width="80%" height={24} />
        </div>
        <Skeleton count={2} height={14} className="mt-2" />
        <div className="flex items-center justify-between border-t border-stone-100 pt-4 mt-4">
          <Skeleton width={60} height={28} />
          <Skeleton width={40} height={20} />
        </div>
        <Skeleton height={42} className="mt-2 rounded-lg" />
      </div>
    </article>
  ));
}
