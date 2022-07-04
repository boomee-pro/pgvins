import { withTRPC } from "@trpc/next";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";

import "../styles/globals.css";
import type { AppRouter } from "../server/router";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      // && process.env.NODE_ENV !== "development"
      session
    ) {
      LogRocket.init("nrcsn7/pgvins");
      LogRocket.identify(session.user.email, {
        name: session.user.name,
        email: session.user.email,
      });
      setupLogRocketReact(LogRocket);
    }
  }, [session]);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  if (process.browser) return ""; // Browser should use current path
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
