import Head from "next/head";
import { Col, Container, Row } from "react-grid-system";
import BreadCrumbs from "../../component/breadcrumbs";

import Card from "../../component/card";
import { trpc } from "../../utils/trpc";

const Wines = () => {
  const winesQuery = trpc.useQuery(["wines.all"]);
  if (!winesQuery.data) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Head>
        <title>Nos vins</title>
        <meta name="description" content="Liste des vins" />
      </Head>
      <Container>
        <BreadCrumbs
          items={[
            { title: "Accueil", destination: "/" },
            { title: "Liste des vins", active: true },
          ]}
        />
        <Row style={{ rowGap: "5em" }}>
          {winesQuery.data.map((wine) => (
            <Col xs={12} md={4} lg={3} key={wine.id}>
              <Card wine={wine} />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Wines;
