import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` no client (roda antes do navegador pintar, evita flash
 * visual em coisas como visibilidade do header) e `useEffect` no servidor
 * (useLayoutEffect não faz nada em SSR e gera warning no console).
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
