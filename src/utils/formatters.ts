import { Vehicle, BusinessSettings } from '../types';

export function formatPKR(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(amount).replace('PKR', 'Rs. ');
}

export function formatPKRShort(amount: number): string {
  if (amount >= 10000000) {
    const crore = amount / 10000000;
    return `Rs. ${crore % 1 === 0 ? crore : crore.toFixed(2)} Crore`;
  }
  if (amount >= 100000) {
    const lakh = amount / 100000;
    return `Rs. ${lakh % 1 === 0 ? lakh : lakh.toFixed(2)} Lakh`;
  }
  return formatPKR(amount);
}

export function formatMileage(km: number): string {
  return `${new Intl.NumberFormat('en-PK').format(km)} km`;
}

export function formatEngineCc(cc: number): string {
  return `${new Intl.NumberFormat('en-PK').format(cc)} cc`;
}

export function buildWhatsAppInquiryUrl(vehicle: Vehicle, settings: BusinessSettings): string {
  // Clean phone number: remove non-digits
  const cleanNumber = settings.whatsappNumber.replace(/\D/g, '');
  if (!cleanNumber) return '';

  const messageText = `Assalam-o-Alaikum Shahid Leghari Sahib,\n\nI am inquiring about the ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.variant} (Ref: ${vehicle.id}) listed at Leghari Motors for ${formatPKR(vehicle.pricePKR)}.\n\nCould you please share further details and confirm if it is available for inspection at your Dera Ghazi Khan showroom?\n\nThank you.`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(messageText)}`;
}

export function buildCallShowroomUrl(settings: BusinessSettings): string {
  const cleanNumber = settings.phone.replace(/[^\d+]/g, '');
  return `tel:${cleanNumber}`;
}
