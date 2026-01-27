import { SupabaseService } from './supabase-service';
import { Order, Product, Variant, ClinicRegistration } from '@/types/db';

// Re-exporting SupabaseService as the primary service provider
// This replaces the previous mock implementation

export const ProductService = {
  async getProducts() {
    return SupabaseService.getProducts();
  },

  async getBySlug(slug: string) {
    return SupabaseService.getProductBySlug(slug);
  },

  async getProduct(slug: string) {
    return SupabaseService.getProduct(slug);
  },

  async updateStock(variantId: string, quantity: number) {
    return SupabaseService.updateStock(variantId, quantity);
  },
  
  async updateProduct(product: Partial<Product> & { id: string }) {
    return SupabaseService.updateProduct(product);
  },

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
    return SupabaseService.createProduct(product);
  },

  async deleteProduct(id: string) {
    return SupabaseService.deleteProduct(id);
  },

  async updateVariant(variant: Partial<Variant> & { id: string }) {
    return SupabaseService.updateVariant(variant);
  },

  async createVariant(variant: Omit<Variant, 'id' | 'created_at'>) {
    return SupabaseService.createVariant(variant);
  },

  async deleteVariant(id: string) {
    return SupabaseService.deleteVariant(id);
  }
};


export const OrderService = {
  async getOrders() {
    return SupabaseService.getOrders();
  },

  async getOrder(orderId: string, phone: string) {
    return SupabaseService.getOrder(orderId, phone);
  },

  async updateStatus(orderId: string, status: Order['status']) {
    return SupabaseService.updateStatus(orderId, status);
  },
  
  async createOrder(order: Omit<Order, 'id' | 'created_at'>) {
    return SupabaseService.createOrder(order);
  }
};

export const ClinicService = {
  async getRegistrations() {
    return SupabaseService.getClinicRegistrations();
  },

  async createRegistration(registration: Omit<ClinicRegistration, 'id' | 'created_at' | 'status'>) {
    return SupabaseService.createClinicRegistration(registration);
  },

  async updateStatus(id: string, status: 'approved' | 'rejected') {
    return SupabaseService.updateRegistrationStatus(id, status);
  }
};
