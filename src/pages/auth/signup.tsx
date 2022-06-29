import { GetServerSidePropsContext } from "next";
import Head from "next/head";

import { parseRequest } from "../../utils/sessions";

export async function getServerSideProps(context: GetServerSidePropsContext) {
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
}

const Signup = () => {
  return (
    <>
      <Head>
        <title>login</title>
      </Head>
      <h1>Sign-up</h1>
    </>
  );
};

export default Signup;
