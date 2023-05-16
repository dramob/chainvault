import { ConnectButton } from "@rainbow-me/rainbowkit";
import styles from "../../styles/Navbar.module.css";
import "bootstrap/dist/css/bootstrap.css";

export default function Navbar() {
  return (
    <nav className={`navbar navbar-expand-lg navbar-dark bg-dark ${styles.navbar}`}>
      <a href="https://enseignements.telecom-sudparis.eu/fiche.php?m=21069" target="_blank">
        <img className={styles.logo} src="/logo.svg" alt="Logo" />
      </a>
      <div className={styles.title_container}>
        <h1 className={`navbar-title mx-auto text-light ${styles.navbar_title}`}>Chainvault</h1>
      </div>
      <div className={styles.buttons_container}>
        <a className="btn btn-outline-light me-2" href="#dcapp">DCApp</a>
        <a className="btn btn-outline-light me-2" href="#about">About</a>
        <a className="btn btn-outline-light me-2" href="#team">Our Team</a>
      </div>
      <ConnectButton />
    </nav>
  );
}
