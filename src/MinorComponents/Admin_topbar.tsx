import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/adminDashboard.module.css";

const Profile: React.FC = () => {
  
  const { user: currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return <div className={styles.greetings}>Loading…</div>;
  }

  const userName = currentUser.firstName;

  return (
    <>
      <div className={styles.greetings}><span>Hi, welcome back</span>  {userName}!</div>
      <div className={styles.profileholder}>
        Lorem, uam assume perspiciatis reprehenderit
      </div>
    </>
  );
};

export default Profile;
