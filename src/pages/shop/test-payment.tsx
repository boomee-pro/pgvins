import axios from "axios";
import { getStripe } from "../../utils/stripe";

const TestPayment = () => {
  const item = {
    price: 100 * 100, // cents * 100
    quantity: 2,
    name: "Test",
  };
  const testCheckout = async () => {
    axios
      .post("/api/stripe/session", item)
      .then(async (res) => {
        console.log(JSON.stringify(res));
        const stripe = await getStripe();
        const { error } = await stripe!.redirectToCheckout({
          sessionId: res.data.id,
        });
        console.warn(error.message);
      })
      .catch((error) => alert(error));
  };

  return (
    <div>
      <h1>Test paiement</h1>
      <p>
        Vous aller acheter ceci: <strong>{JSON.stringify(item)}</strong>
      </p>
      <button onClick={testCheckout}>ACHETER</button>
    </div>
  );
};

export default TestPayment;
