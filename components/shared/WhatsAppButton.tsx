import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
  className?: string;
}

export default function WhatsAppButton({
  phoneNumber,
  message = '',
  className = '',
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 rounded-lg transition-all ${className}`}
    >
      <MessageCircle className="w-5 h-5" />
      واتساب
    </button>
  );
}
