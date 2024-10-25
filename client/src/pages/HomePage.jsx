import AddCar from "../components/forms/AddCar";
import AddPerson from "../components/forms/AddPerson";
import Records from "../components/Records";
import { useState, useEffect } from "react";
import { Divider } from "antd";
import { ADD_CAR, ADD_PERSON, BASE_URL, GET_PEOPLE } from "../graphql/queries";
import { useQuery } from "@apollo/client";

const HomePage = () => {
  const { loading, error, data } = useQuery(GET_PEOPLE);

  const [people, setPeople] = useState([]);

  useEffect(() => {
    if (data) {
      setPeople(
        data.people.map((person) => ({
          ...person,
          cars: person.cars || [],
        }))
      );
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...{error.message}</p>;

  return (
    <div>
      <AddPerson />

      {people.length !== 0 && <AddCar people={people} />}

      <Records people={people} />
    </div>
  );
};

export default HomePage;
