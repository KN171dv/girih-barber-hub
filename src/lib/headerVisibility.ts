/**
 * Sinal compartilhado simples (fora do React) pra sincronizar a visibilidade
 * do header fixo com a Fase 1 do vídeo de introdução (ScrollVideoIntro).
 *
 * Por padrão o header fica visível — só a home, que renderiza
 * ScrollVideoIntro, chega a escondê-lo (enquanto o pin do vídeo está ativo).
 * Nas demais páginas ninguém chama `setHeaderVisible(false)`, então o header
 * nunca é afetado.
 */
type Listener = () => void;

let visible = true;
const listeners = new Set<Listener>();

export function setHeaderVisible(next: boolean) {
  if (visible === next) return;
  visible = next;
  listeners.forEach((listener) => listener());
}

export function subscribeHeaderVisible(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getHeaderVisible() {
  return visible;
}
