// src/app/admin/offers/page.js
import ProductManagement from '@/app/components/ProductManagement';

export default function AdminOffersPage() {
  // Renderujemy komponent zarządzania w trybie admina
  return <ProductManagement isAdmin={true} />;
}