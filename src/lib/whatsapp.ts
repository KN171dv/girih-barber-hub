const BRAND = "Gireh Barber";

export function onlyDigits(value: string | null | undefined) {
  return (value ?? "").replace(/\D/g, "");
}

/**
 * Monta um link do WhatsApp. Se o número não estiver cadastrado ainda,
 * retorna null para que a interface possa exibir um aviso de "configurar".
 */
export function whatsappLink(phone: string | null | undefined, message: string) {
  const digits = onlyDigits(phone);
  if (!digits) return null;
  const withCountry = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountry}?text=${encodeURIComponent(message)}`;
}

export function barberBookingMessage(barberName: string, serviceName?: string) {
  const name = barberName?.trim() || "barbeiro";
  const service = serviceName?.trim() || "um serviço";
  return `Olá! Vi o perfil do ${name} no site da ${BRAND} e gostaria de agendar um horário para ${service}.`;
}

export function serviceBookingMessage(serviceName?: string) {
  const service = serviceName?.trim() || "um serviço";
  return `Olá! Vim pelo site da ${BRAND} e gostaria de agendar um horário para ${service}.`;
}

export function planMessage(planName?: string) {
  const plan = planName?.trim() || "um plano";
  return `Olá! Vim pelo site da ${BRAND} e tenho interesse na assinatura ${plan}.`;
}

export function generalMessage() {
  return `Olá! Vim pelo site da ${BRAND} e gostaria de agendar um horário.`;
}
