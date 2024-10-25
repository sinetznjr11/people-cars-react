import { Card, Typography, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { DELETE_CAR, GET_PEOPLE } from "../../graphql/queries";
import { useState } from "react";
import UpdateCar from "../forms/UpdateCar";

const Car = ({ car, people, person }) => {
  const { Paragraph } = Typography;
  const [editMode, setEditMode] = useState(false);

  const [deleteCar] = useMutation(DELETE_CAR, {
    update: (cache, { data: { deleteCar } }) => {
      const data = cache.readQuery({ query: GET_PEOPLE });

      const updatedPeople = data.people.map((person) => ({
        ...person,
        cars: person.cars.filter((c) => c.id !== deleteCar.id),
      }));

      cache.writeQuery({
        query: GET_PEOPLE,
        data: {
          ...data,
          people: updatedPeople,
        },
      });
    },
    onCompleted: () => {
      message.success(`Car ${car.make} ${car.model} deleted successfully.`);
      console.log("Car deleted successfully!");
    },
    onError: (error) => {
      message.error("Failed to delete car.");
      console.error("Error deleting car:", error);
    },
  });

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleDelete = () => {
    deleteCar({
      variables: {
        id: car.id,
      },
    });
  };

  return (
    <div>
      {!editMode ? (
        <Card
          type="inner"
          title={`${car.make} ${car.model}`}
          style={{ marginBottom: "16px" }}
          actions={[
            <EditOutlined key="edit" onClick={handleEdit} />,
            <Popconfirm
              key="delete"
              title={`Are you sure you want to delete ${car.make} ${car.model}?`}
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined />
            </Popconfirm>,
          ]}
        >
          <Paragraph>Price: ${car.price}</Paragraph>
          <Paragraph>Year: {car.year}</Paragraph>
        </Card>
      ) : (
        <UpdateCar
          item={car}
          people={people}
          person={person}
          onCancel={handleEdit}
        />
      )}
    </div>
  );
};

export default Car;
