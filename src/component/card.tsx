import styles from "../styles/card.module.scss";

import { BiShow } from "react-icons/bi";
import { Wine } from "@prisma/client";

type Props = {
  wine: Wine;
};

const Card = ({ wine }: Props) => {
  return (
    <div className={styles.card__container}>
      <div className={styles.card__image}>
        <div className={styles.card__overflow}>
          <div className={styles.card__background}></div>
        </div>

        {/* <img className={styles.wine__img} src={wine.img} alt="" />
        <img className={styles.wine__flag} src={wine.flag} alt="" /> */}
      </div>

      <h2>{wine.origin}</h2>
      <p>{wine.name}</p>
      <h3>{wine.price} €</h3>

      <div className={styles.card__buttons}>
        <button>Ajouter</button>
        <a href={`/wines/${wine.id}`}>
          <BiShow size={24} />
        </a>
      </div>
    </div>
  );
};

export default Card;
