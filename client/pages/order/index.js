const Orders = ({ orders }) => {
  return (
    <div>
      {orders.map((order) => {
        return (
          <p>
            {order.ticket.title}- {order.status}
          </p>
        );
      })}
    </div>
  );
};

Orders.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/order/all");
  return { orders: data };
};

export default Orders;
