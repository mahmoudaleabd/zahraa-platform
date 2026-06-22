'use client';

import Image from 'next/image';
import { MenuItem } from '@/services/businessService';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface MenuItemProps {
  item: MenuItem;
  businessId: string;
}

export default function MenuItemComponent({ item, businessId }: MenuItemProps) {
  const { addItem, updateQuantity, items } = useCartStore();
  
  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    addItem(
      {
        id: item.id!,
        name: item.name,
        price: item.price,
        image: item.image,
      },
      businessId
    );
  };

  const handleIncrease = () => {
    updateQuantity(item.id!, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(item.id!, quantity - 1);
    } else {
      updateQuantity(item.id!, 0);
    }
  };

  if (!item.available) {
    return (
      <div className="bg-[#1a1613] border border-[#2d2722] rounded-lg p-4 opacity-50">
        <div className="flex items-start gap-4">
          {item.image && (
            <div className="relative w-24 h-24 flex-shrink-0 bg-[#0e0c0a] rounded-lg overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-[#f2e8df] font-bold mb-1">{item.name}</h3>
            {item.description && (
              <p className="text-[#a69584] text-sm mb-2 line-clamp-2">
                {item.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-[#dfba7a] font-bold">
                {item.price.toLocaleString('ar-EG')} ج.م
              </span>
              <span className="text-[#a69584] text-sm">غير متوفر</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1613] border border-[#2d2722] rounded-lg p-4 hover:border-[#dfba7a]/50 transition-all">
      <div className="flex items-start gap-4">
        {item.image && (
          <div className="relative w-24 h-24 flex-shrink-0 bg-[#0e0c0a] rounded-lg overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-[#f2e8df] font-bold mb-1">{item.name}</h3>
          {item.description && (
            <p className="text-[#a69584] text-sm mb-2 line-clamp-2">
              {item.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-[#dfba7a] font-bold">
              {item.price.toLocaleString('ar-EG')} ج.م
            </span>
            
            {quantity === 0 ? (
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#dfba7a] hover:bg-[#cda767] text-[#0e0c0a] rounded-lg text-sm font-bold transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                أضف
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDecrease}
                  className="w-8 h-8 flex items-center justify-center bg-[#0e0c0a] border border-[#2d2722] text-[#f2e8df] rounded-lg hover:border-[#dfba7a] transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center text-[#f2e8df] font-bold">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  className="w-8 h-8 flex items-center justify-center bg-[#dfba7a] text-[#0e0c0a] rounded-lg hover:bg-[#cda767] transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
