import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    // Desligado de propósito: o router tem seu próprio sistema de restauração
    // de scroll (independente do `history.scrollRestoration` nativo do
    // navegador) que reabria a página na posição antiga ao dar F5 — o site
    // deve sempre abrir do topo.
    scrollRestoration: false,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
