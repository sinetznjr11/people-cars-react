import { Button, Card, Popconfirm } from "antd";
import Car from "./Car";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { DELETE_PERSON, GET_PEOPLE } from "../../graphql/queries";
import { useState } from "react";
import UpdatePerson from "../forms/UpdatePerson";

const Person = ({ person, people }) => {
  const [editMode, setEditMode] = useState(false);

  const [deletePerson] = useMutation(DELETE_PERSON, {
    onCompleted: () => {
      console.log("Person deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting person:", JSON.stringify(error));
    },
    update(cache) {
      const { people: existingPeople } = cache.readQuery({ query: GET_PEOPLE });

      const newPeople = existingPeople.filter((p) => p.id !== person.id);

      cache.writeQuery({
        query: GET_PEOPLE,
        data: { people: newPeople },
      });
    },
  });

  const handleDelete = () => {
    deletePerson({
      variables: {
        id: person.id,
      },
    });
  };

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  return (
    <div>
      {!editMode ? (
        <Card
          title={`${person.firstName} ${person.lastName}`}
          style={{ marginBottom: "36px" }}
          actions={[
            <EditOutlined key="edit" onClick={handleEdit} />,
            <Popconfirm
              key="delete"
              title={`Are you sure you want to delete ${person.firstName} ${person.lastName}?`}
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined key="delete" />
            </Popconfirm>,
          ]}
        >
          {person.cars && person.cars.length > 0 ? (
            person.cars.map((car) => (
              <Car key={car.id} car={car} people={people} person={person} />
            ))
          ) : (
            <p>No cars</p>
          )}

          <Link to={`/people/${person.id}`}>
            <Button type="link" style={{ marginTop: "16px" }}>
              Learn More
            </Button>
          </Link>
        </Card>
      ) : (
        <UpdatePerson onCancel={handleEdit} person={person} />
      )}
    </div>
  );
};

export default Person;
