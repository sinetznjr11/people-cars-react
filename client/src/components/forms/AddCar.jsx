import { Button, Divider, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_CAR, GET_PEOPLE } from "../../graphql/queries";

const AddCar = ({ people }) => {
  const [form] = Form.useForm();
  const [peopleOptions, setPeopleOptions] = useState([]);

  // Prepare options for select dropdown
  useEffect(() => {
    if (people) {
      const options = people.map((person) => ({
        value: person.id,
        label: `${person.firstName} ${person.lastName}`,
      }));
      setPeopleOptions(options);
    }
  }, [people]);

  const [addCar, { loading }] = useMutation(ADD_CAR, {
    onCompleted: (data) => {
      form.resetFields();
      message.success("Car added successfully!");
      console.log("Car added successfully!", data);
    },
    onError: (error) => {
      form.resetFields();
      message.error("Failed to add car.");
      console.log(JSON.stringify(error, null, 2));
    },
  });

  const onFinish = async (values) => {
    const newCar = {
      year: parseInt(values.year),
      make: values.make,
      model: values.model,
      price: parseFloat(values.price),
      personId: values.person,
    };

    try {
      await addCar({
        variables: {
          year: newCar.year,
          make: newCar.make,
          model: newCar.model,
          price: newCar.price,
          personId: newCar.personId,
        },
        update: (cache, { data: { addCar } }) => {
          const { people } = cache.readQuery({ query: GET_PEOPLE }) || {
            people: [],
          };

          const updatedPeople = people.map((person) => {
            if (person.id === newCar.personId) {
              return {
                ...person,
                cars: [...(person.cars || []), addCar],
              };
            }
            return person;
          });

          cache.writeQuery({
            query: GET_PEOPLE,
            data: {
              people: updatedPeople,
            },
          });
        },
      });
      message.success("Car added successfully!");
    } catch (error) {
      message.error("Something went wrong!");
      console.log(JSON.stringify(error, null, 2));
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div style={{ marginBottom: "36px" }}>
      <Divider>Add Car</Divider>

      <Form
        form={form}
        name="add-car-form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={formStyle}
      >
        <Form.Item
          label="Year"
          name="year"
          rules={[
            {
              required: true,
              message: "Please input the car year!",
            },
          ]}
        >
          <Input placeholder="Year" />
        </Form.Item>

        <Form.Item
          label="Make"
          name="make"
          rules={[
            {
              required: true,
              message: "Please input the car make!",
            },
          ]}
        >
          <Input placeholder="Make" />
        </Form.Item>

        <Form.Item
          label="Model"
          name="model"
          rules={[
            {
              required: true,
              message: "Please input the car model!",
            },
          ]}
        >
          <Input placeholder="Model" />
        </Form.Item>

        <Form.Item
          label="Price $"
          name="price"
          rules={[
            {
              required: true,
              message: "Please input the car price!",
            },
          ]}
        >
          <Input placeholder="Price $" type="number" />
        </Form.Item>

        <Form.Item
          label="Person"
          name="person"
          rules={[
            {
              required: true,
              message: "Please select a person!",
            },
          ]}
        >
          <Select placeholder="Select a person" options={peopleOptions} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Car
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const formStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
};

export default AddCar;
