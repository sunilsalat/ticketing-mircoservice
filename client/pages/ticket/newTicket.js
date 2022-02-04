import { useState } from "react";
import useRequest from "../../custom-hooks/use-request";
import Router from "next/router";

const newTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/ticket/t",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };

  // function to sanitize a price
  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Create a new Ticket</h1>

      <div className="form-group">
        <label>Title:</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label>Price:</label>
        <input
          value={price}
          onBlur={onBlur}
          onChange={(e) => setPrice(e.target.value)}
          className="form-control"
          required
        />
      </div>
      {errors}
      <button type="submit" className="bnt btn-primary">
        Sign Up
      </button>
    </form>
  );
};

export default newTicket;
