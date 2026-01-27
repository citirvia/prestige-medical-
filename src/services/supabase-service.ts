import { supabase } from '@/lib/supabase/client';
import { Product, Variant, Order, ClinicRegistration } from '@/types/db';

// --- Types ---
// Helper to match DB shape to App shape if needed
// For now assuming App types match DB types closely or we map them.

export const SupabaseService = {
  // --- PRODUCTS ---
  async getProducts(): Promise<(Product & { variants: Variant[] })[]> {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        variants (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    return products as (Product & { variants: Variant[] })[];
  },

  async getProduct(id: string): Promise<(Product & { variants: Variant[] }) | null> {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        variants (*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {}
    return (product ?? null) as (Product & { variants: Variant[] }) | null;
  },

  async getProductBySlug(slug: string): Promise<(Product & { variants: Variant[] }) | null> {
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        variants (*)
      `)
      .eq('slug', slug)
      .maybeSingle();

    if (error) {}
    return (product ?? null) as (Product & { variants: Variant[] }) | null;
  },

  async getProductByIdentifier(identifier: string): Promise<(Product & { variants: Variant[] }) | null> {
    // 1) Try slug
    const bySlug = await this.getProductBySlug(identifier);
    if (bySlug) return bySlug;
    // 2) Try id
    const byId = await this.getProduct(identifier);
    if (byId) return byId;
    // 3) Try names (fr/en) equal to identifier
    const { data: byName, error } = await supabase
      .from('products')
      .select(`
        *,
        variants (*)
      `)
      .or(`name->>fr.eq.${identifier},name->>en.eq.${identifier}`)
      .maybeSingle();
    if (!error && byName) return byName as (Product & { variants: Variant[] });
    return null;
  },

  async updateProduct(product: Partial<Product> & { id: string }): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({
        ...product,
        updated_at: new Date().toISOString()
      })
      .eq('id', product.id);

    if (error) throw error;
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
    const slug =
      product.slug ||
      (product.name?.fr || product.name?.en || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    // Try insert with slug; if slug column missing, retry without it
    const insertPayload = { ...product, slug };
    const { data, error } = await supabase
      .from('products')
      .insert(insertPayload)
      .select()
      .single();

    if (error && String(error?.message || '').includes('column')) {
      const { data: dataNoSlug, error: errorNoSlug } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
      if (errorNoSlug) {
        return null;
      }
      return dataNoSlug;
    }
    if (error) {
      return null;
    }
    return data;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async updateVariant(variant: Partial<Variant> & { id: string }): Promise<void> {
    const { error } = await supabase
      .from('variants')
      .update(variant)
      .eq('id', variant.id);
    
    if (error) throw error;
  },

  async createVariant(variant: Omit<Variant, 'id' | 'created_at'>): Promise<Variant | null> {
    const { data, error } = await supabase
      .from('variants')
      .insert(variant)
      .select()
      .single();

    if (error) {
      console.error('Error creating variant:', error);
      return null;
    }
    return data;
  },

  async deleteVariant(id: string): Promise<void> {
    const { error } = await supabase
      .from('variants')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },


  async updateStock(variantId: string, quantity: number): Promise<void> {
    const { error } = await supabase
      .from('variants')
      .update({ stock_quantity: quantity })
      .eq('id', variantId);

    if (error) throw error;
  },

  // --- ORDERS ---
  async getOrders(): Promise<Order[]> {
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
    
    // Map DB structure to App structure if strictly needed, but assuming match
    // Note: 'items' in DB might be returned as 'order_items' depending on relation name
    // If we used foreign key, Supabase uses the table name by default
    return orders.map(o => ({
      ...o,
      items: o.items || [] 
    })) as Order[];
  },

  async getOrder(orderId: string, phone: string): Promise<Order | null> {
    // Phone normalization could happen here
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (*)
      `)
      .eq('id', orderId)
      // We might need to filter phone on client side if format varies, 
      // but ideally we normalize on save. For now, strict match or client filter.
      // Let's fetch by ID and verify phone in code to be safe with formats.
      .single();

    if (error || !orders) return null;

    const dbPhone = orders.customer_details?.phone?.replace(/\D/g, '') || '';
    const queryPhone = phone.replace(/\D/g, '');

    if (dbPhone.includes(queryPhone) || queryPhone.includes(dbPhone)) {
       return {
         ...orders,
         items: orders.items || []
       } as Order;
    }

    return null;
  },

  async createOrder(order: Omit<Order, 'id' | 'created_at'>): Promise<Order | null> {
    // 1. Create Order
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_type: order.customer_type,
        status: 'pending',
        total_price: order.total_price,
        customer_details: order.customer_details,
        logistics_type: order.logistics_type
      })
      .select()
      .single();

    if (orderError || !newOrder) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    // 2. Create Items
    const itemsToInsert = order.items.map(item => ({
      order_id: newOrder.id,
      variant_id: item.variant_id,
      product_name: item.product_name,
      variant_name: item.variant_name,
      quantity: item.quantity,
      price_at_time_of_order: item.price_at_time_of_order
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      // Ideally rollback order here
    }

    return { ...newOrder, items: order.items } as Order;
  },

  async updateStatus(orderId: string, status: Order['status']): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);

    if (error) throw error;
  },

  // --- CLINIC REGISTRATIONS ---
  async getClinicRegistrations(): Promise<ClinicRegistration[]> {
    const { data, error } = await supabase
      .from('clinic_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching registrations:', error);
      return [];
    }
    return data as ClinicRegistration[];
  },

  async createClinicRegistration(registration: Omit<ClinicRegistration, 'id' | 'created_at' | 'status'>): Promise<void> {
    const { error } = await supabase
      .from('clinic_registrations')
      .insert({
        ...registration,
        status: 'pending'
      });
    
    if (error) throw error;
  },

  async updateRegistrationStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    const { error } = await supabase
      .from('clinic_registrations')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
  }
};
