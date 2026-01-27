'use server';

import { SupabaseService } from '@/services/supabase-service';
import { revalidatePath } from 'next/cache';
import type { Product, Variant } from '@/types/db';

export async function updateStockAction(variantId: string, quantity: number) {
  console.log(`[Server Action] Updating stock for ${variantId} to ${quantity}`);
  await SupabaseService.updateStock(variantId, quantity);
  revalidatePath('/'); // Revalidate everything for simplicity in this mock setup
}

export async function getInventoryAction() {
  return await SupabaseService.getProducts();
}

export async function createProductAction(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
  const result = await SupabaseService.createProduct(product);
  revalidatePath('/');
  return result;
}

export async function updateProductAction(product: Partial<Product> & { id: string }) {
  await SupabaseService.updateProduct(product);
  revalidatePath('/');
}

export async function deleteProductAction(id: string) {
  await SupabaseService.deleteProduct(id);
  revalidatePath('/');
}

export async function createVariantAction(variant: Omit<Variant, 'id' | 'created_at'>) {
  await SupabaseService.createVariant(variant);
  revalidatePath('/');
}

export async function deleteVariantAction(id: string) {
  await SupabaseService.deleteVariant(id);
  revalidatePath('/');
}
