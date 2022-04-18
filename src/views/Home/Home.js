import { useState } from "react";
import StackGuard from "../StackGuard/StackGuard";
import "./Home.scss";
import Overflow from "../Overflow/Overflow";
import StackShield from "../StackShield/StackShield";

export default function Home() {
  const [tabNo, setTabNo] = useState(0);

  return (
    <div className="HomeWrapper">
      <h1 className="HomeWrapper__Title">Buffer Overflow</h1>
      <main className="HomeWrapper__Container">
        <nav className="HomeWrapper__NavBar">
          <li
            className={`HomeWrapper__NavBar--Item ${
              tabNo === 0 ? "HomeWrapper__NavBar--Item--Active" : ""
            }`}
            onClick={() => setTabNo(0)}
          >
            Overflow
          </li>
          <li
            className={`HomeWrapper__NavBar--Item ${
              tabNo === 1 ? "HomeWrapper__NavBar--Item--Active" : ""
            }`}
            onClick={() => setTabNo(1)}
          >
            Stack Guard
          </li>
          <li
            className={`HomeWrapper__NavBar--Item ${
              tabNo === 2 ? "HomeWrapper__NavBar--Item--Active" : ""
            }`}
            onClick={() => setTabNo(2)}
          >
            Stack Shield
          </li>
        </nav>
        <section className="HomeWrapper__Section">
          {tabNo === 0 && <Overflow />}
          {tabNo === 1 && <StackGuard />}
          {tabNo === 2 && <StackShield />}
        </section>
      </main>
    </div>
  );
}
