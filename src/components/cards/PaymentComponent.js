import axios from "axios";
import { FilledButton } from "../components";
import Razorpay from "razorpay";

const PyamentComponent = () => {
  return (
    <>
      <FilledButton
        active={true}
        callEvent={async () => {
          let { data: order } = await axios.post(
            "http://localhost:5000/checkout"
          );
          let { data: key } = await axios.post("http://localhost:5000/getkey");
          order = order.order;
          var options = {
            key: key.key, // Enter the Key ID generated from the Dashboard
            amount: order.amount || 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: "INR",
            name: "dev comm",
            description: "Test Transaction",
            order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            // callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
            callback_url: "http://localhost:5000/paymentVarification",
            prefill: {
              name: "Gaurav Kumar",
              email: "gaurav.kumar@example.com",
              contact: "9000090000",
            },
            notes: {
              address: "Razorpay Corporate Office",
            },
            theme: {
              color: "#3399cc",
            },
          };
          console.log(options);
          let razor = new window.Razorpay(options);
          razor.open();
        }}
        text={"Pay"}
        path={""}
      />
    </>
  );
};

export default PyamentComponent;
