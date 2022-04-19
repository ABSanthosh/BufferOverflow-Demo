import StackGuard from "../StackGuard/StackGuard";
import "./Home.scss";
import Overflow from "../Overflow/Overflow";
import StackShield from "../StackShield/StackShield";
import { Link, useHistory, useParams } from "react-router-dom";

export default function Home() {
  let { tab } = useParams();
  const history = useHistory();
  // test
  if (isNaN(tab)) {
    tab = 0;
    history.push("/0");
  }

  return (
    <div className="HomeWrapper">
      <h1 className="HomeWrapper__Title">Buffer Overflow</h1>
      <main className="HomeWrapper__Container">
        <nav className="HomeWrapper__NavBar">
          <Link
            className={`HomeWrapper__NavBar--Item ${
              parseInt(tab) === 0 ? "HomeWrapper__NavBar--Item--Active" : ""
            }`}
            to="/0"
            // onClick={() => setTabNo(0)}
          >
            Overflow
          </Link>
          <Link
            className={`HomeWrapper__NavBar--Item ${
              parseInt(tab) === 1 ? "HomeWrapper__NavBar--Item--Active" : ""
            }`}
            to="/1"
            // onClick={() => setTabNo(1)}
          >
            Stack Guard
          </Link>
          <Link
            className={`HomeWrapper__NavBar--Item ${
              parseInt(tab) === 2 ? "HomeWrapper__NavBar--Item--Active" : ""
            }`}
            to="/2"
            // onClick={() => setTabNo(2)}
          >
            Stack Shield
          </Link>
        </nav>
        <section className="HomeWrapper__Section">
          {parseInt(tab) === 0 && <Overflow />}
          {parseInt(tab) === 1 && <StackGuard />}
          {parseInt(tab) === 2 && <StackShield />}
        </section>
      </main>
    </div>
  );
}
