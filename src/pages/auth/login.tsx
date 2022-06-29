import { GetServerSidePropsContext } from "next";
import Head from "next/head";

import { parseRequest } from "../../utils/sessions";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const user = await parseRequest(context.req);

  if (user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const Login = () => {
  return (
    <>
      <Head>
        <title>Inscription</title>
      </Head>
      <h1>Login</h1>
    </>
  );
};

export default Login;