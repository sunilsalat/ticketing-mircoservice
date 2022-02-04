// Landing Page
import Router from "next/router";
import Link from "next/link";

const Home = ({ currentUser, tickets }) => {
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <td>Title</td>
            <td>Price</td>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => {
            return (
              <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                  <Link href={`/ticket/${ticket.id}`}>
                    <a>Details</a>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// getInitialProps runs on server, inter service calls
Home.getInitialProps = async (context, client, currentUser) => {
  try {
    const { data } = await client.get("/api/ticket/");
    return { tickets: data };
  } catch (error) {
    console.log("could not get Curreent---user");
  }
};

export default Home;
