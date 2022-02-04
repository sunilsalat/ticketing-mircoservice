import Link from "next/link";

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { lable: "Sign Up", href: "/auth/signup" },
    !currentUser && { lable: "Sign In", href: "/auth/signin" },
    currentUser && { lable: "logout", href: "/auth/logout" },
    currentUser && { lable: "sell", href: "/ticket/newTicket" },
    currentUser && { lable: "orders", href: "/order" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ lable, href }) => {
      return (
        <li key={href} className="nav-item mx-2">
          <Link href={href}>
            <a className="nav-link px-2">{lable}</a>
          </Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">Git</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="d-flex align-items-center ">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
