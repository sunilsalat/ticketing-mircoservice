import useRequest from "../../custom-hooks/use-request";
import Router from "next/router";

const ticketDetail = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/order/create",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) => Router.push(`/order/${order.id}`),
  });

  return (
    <div>
      <h1>{ticket.title} </h1>
      <h4>{ticket.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

ticketDetail.getInitialProps = async (context, client) => {
  const { ticketid } = context.query;

  const { data } = await client.get(`/api/ticket/${ticketid}`);

  return { ticket: data };
};

export default ticketDetail;
