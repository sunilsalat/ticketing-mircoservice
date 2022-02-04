import "bootstrap/dist/css/bootstrap.css";
import { BuildRequest } from "../utlis/build-axios-instance";
import Header from "../components/header";
import "./style.css";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div style={{ body: "black", color: "wheat" }}>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  try {
    const client = BuildRequest(appContext.ctx);

    const { data } = await client.get("/api/user/currentuser");

    /**
     * If getInitialProps is defined in (mainPage or _app.js ) than child component wont call getInitialProps mehtod by itself
     * We have to call it separately as on line 23-25
     */
    let pageProps = {};
    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(
        appContext.ctx,
        client,
        data
      );
    }

    return { pageProps, ...data };
  } catch (error) {
    console.log("could not get current user");
  }
};

export default AppComponent;
