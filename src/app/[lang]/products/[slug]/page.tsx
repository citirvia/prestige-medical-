import ProductDetail from "@/components/product/ProductDetail";
import { SupabaseService } from "@/services/supabase-service";

export default async function Page({ params }: { params: Promise<{ slug: string; lang: string }> }) {
  const { slug } = await params;
  const product = await SupabaseService.getProductByIdentifier(slug);
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Produit introuvable</h1>
          <p className="text-slate-600">Le produit demandé n&apos;existe pas.</p>
        </div>
      </div>
    );
  }
  return <ProductDetail product={product} />;
}

// Dynamic rendering to avoid build-time fetch issues
