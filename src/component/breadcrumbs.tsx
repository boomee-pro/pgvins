import Link from "next/link";

import styles from "../styles/breadcrumbs.module.scss";
import classNames from "classnames";

type Item = {
  title: string;
  destination?: string;
  active?: boolean;
};
type Props = {
  items: Item[];
};

const BreadCrumbs = ({ items }: Props) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className={styles.breadcrumb}>
        {items.map((link, i) => (
          <li
            key={i}
            className={classNames(
              styles.breadcrumbItem,
              link.active && styles.breadcrumbActive
            )}
          >
            {!link.active ? (
              <Link href={link.destination || "#"}>{link.title}</Link>
            ) : (
              link.title
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadCrumbs;
