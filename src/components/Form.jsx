// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Button from './Button';
import styles from "./Form.module.css";
import BackButton from "./BackButton";
import Spinner from './Spinner';
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from './Message';
import { useCities } from "../context/CitiesContext";
import { useNavigate } from "react-router-dom";


export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client"
function Form() {
  const [lat, lng] = useUrlPosition();
  const {createCity, isLoading} = useCities();
  const [cityName, setCityName] = useState("");
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false); 
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [emoji, setEmoji] = useState(""); 
  const [notes, setNotes] = useState("");
  const [geoCodeError, setGeoCodeError] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{
    if(!lat && !lng) return;
    const fetchCityData = async () =>{
      try{
        setIsLoadingGeocoding(true);
        setGeoCodeError("");
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if(!data.countryCode){
          throw new Error("That doesn't seem to be a city. Click somewhere else 😉")
        }
        console.log(data);
        setCityName(data.city || data.locality || "");
        setCountry(data.countryName)
        setEmoji(convertToEmoji(data.countryCode));
      }
      catch(err){
        setGeoCodeError(err.message);
      }
      finally{
        setIsLoadingGeocoding(false);
      }
    } 
    fetchCityData();
  },[lat, lng])

  if(!lat && !lat){
    return <Message message="Start by clicking somewhere 😀."/>
  }

  if(geoCodeError){
    return <Message message={geoCodeError} />
  }

  const handleSubmit = async (e) =>{
    e.preventDefault();
    if(!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position : {lat, lng}
    }
    await createCity(newCity)
    navigate("/app");
  }
  return (
    <>
    {isLoadingGeocoding ? <Spinner /> : 
    <form className={`${styles.form} ${isLoading ? styles.loading : ""}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker id="date" onChange={(date)=>setDate(date)} selected={date} dateFormat="dd/MM/yy"/>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>}
    </>
  );
}

export default Form;
