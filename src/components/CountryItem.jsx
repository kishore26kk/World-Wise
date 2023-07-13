/* eslint-disable react/prop-types */
import styles from "./CountryItem.module.css";

function CountryItem({ country }) {

  console.log(country)
  return (
    <li className={styles.countryItem} key={country.cityName}>
      <span>{country.emoji}</span>
      <span>{country.country}</span>
    </li>
  );
}

export default CountryItem;
