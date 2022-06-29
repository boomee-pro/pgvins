import { User } from "@prisma/client";
import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import superjson from "superjson";

import { parseRequest } from "../utils/sessions";
import Login from "./auth/login";

interface Props {
  user?: User;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const user = await parseRequest(context.req);
  if (!user) return { props: {} };

  return {
    props: superjson.serialize({
      user,
    }).json,
  };
};

const Home: NextPage = ({ user }: Props) => {
  if (!user) return <Login />;
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Hello world</h1>
    </>
  );
};

export default Home;
