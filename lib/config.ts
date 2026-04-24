export const WHATSAPP_NUMBER = "233249754347";
export const WHATSAPP_DISPLAY = "+233 24 975 4347";
export const PHONE_TEL = "+233508726113";
export const PHONE_DISPLAY = "0508 726 113";
export const OWNER_EMAIL = "sandalatifa20@gmail.com";
export const CURRENCY = "₵";

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
