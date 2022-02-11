import { useEffect, useState, useRef } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../custom-hooks/use-request";
import Router from "next/router";

const orderDetail = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  console.log(new Date(order.expiresAt));
  console.log(Date());

  const { doRequest, errors } = useRequest({
    url: "/api/payment",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => {
      Router.push("/order");
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const time = new Date(order.expiresAt) - new Date();
      console.log(Math.round(time / 1000));
      setTimeLeft(Math.round(time / 1000));
    };

    findTimeLeft();
    timerRef.current = setInterval(findTimeLeft, 1000);

    return () => {
      console.log("clean - up");
      clearInterval(timerRef.current);
    };
  }, [order]);

  // if (timeLeft < 0) {
  //   return (
  //     <div>
  //       <h1>TIcket - {order.ticket.title}</h1>Time-left to Pay : {timeLeft},,
  //       Order expired
  //     </div>
  //   );
  // }

  return (
    <div>
      <h1>TIcket - {order.ticket.title}</h1>Time-left to Pay : {timeLeft}
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey={process.env.STRIPE_PK}
        email={currentUser.email}
        amount={order.ticket.price * 100}
      />
      {errors}
    </div>
  );
};

orderDetail.getInitialProps = async (context, client) => {
  const { orderid } = context.query;

  const { data } = await client.get(`/api/order/${orderid}`);
  return { order: data };
};

export default orderDetail;
