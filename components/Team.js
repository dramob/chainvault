import React from 'react';
import styles from '../styles/Team.module.css';

const OurTeam = () => {

  const teamMembers = [
    { id: 1, name: 'Alia Dramé', description: 'Front-end Developer', photo: '/alia.jpeg', linkedin: 'https://www.linkedin.com/in/alia-drame/' },
    { id: 2, name: 'Neil Braun', description: 'Blockchain Developer', photo: '/neil.jpeg', linkedin: 'https://www.linkedin.com/in/alexis-toppe/' },
    { id: 3, name: 'Akli Ait-Ouméziane', description: 'Blockchain/Front-end Developer', photo: '/akli.jpeg', linkedin: 'https://www.linkedin.com/in/akli-ait-oumeziane/' },
    { id: 4, name: 'Adnene Oulali', description: 'Blockchain Developer', photo: '/adnene.jpeg', linkedin: 'https://www.linkedin.com/in/aymeric-f%C3%BCl%C3%B6p-30a78719a/' },
  ];

  return (
    <div className={styles.content}>
      <p className={styles.teamIntro}>
        Nous sommes un groupe de quatre étudiants passionnés par la technologie blockchain et le développement front-end. Chacun de nous apporte des compétences uniques et complémentaires à l'équipe, allant du développement front-end à la blockchain. Nous sommes déterminés à apporter nos connaissances et notre passion à chaque projet sur lequel nous travaillons. Rencontrez notre équipe ci-dessous :
      </p>
      <div className={styles.teamGrid}>
        {teamMembers.map((member) => (
          <div key={member.id} className={styles.teamMember}>
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
              <img className={styles.memberPhoto} src={member.photo} alt={member.name} />
            </a>
            <h3 className={styles.memberName}>{member.name}</h3>
            <p className={styles.memberDescription}>{member.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default OurTeam;