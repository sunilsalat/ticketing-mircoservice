import { useState } from "react";
import useRequest from "../../custom-hooks/use-request";
import Router from "next/router";

const signUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/user/signup",
    method: "post",
    body: { name, email, password },
    onSuccess: () => Router.push("/"),
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    await doRequest();
  };

  return (
    <form onSubmit={(e) => submitHandler(e)}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Name:</label>
        <input
          vlaue={name}
          onChange={(e) => setName(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label>Email Address:</label>
        <input
          type="email"
          vlaue={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          vlaue={password}
          onChange={(e) => setPassword(e.target.value)}
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

export default signUp;
