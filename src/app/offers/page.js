// src/app/offers/page.js
import ProductManagement from '@/app/components/ProductManagement';

export default function UserOffersPage() {
  // Renderujemy ten sam komponent, ale w trybie użytkownika (isAdmin=false jest domyślne)
  return <ProductManagement />;
}