import Router from "next/router";
import { useEffect } from "react";
import useRequest from "../../custom-hooks/use-request";

const Logout = () => {
  const { doRequest, errors } = useRequest({
    url: "/api/user/logout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div>
      Signning you out ...
      {errors}
    </div>
  );
};

export default Logout;
