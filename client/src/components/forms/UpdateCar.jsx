import { Button, Card, Divider, Form, Input, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { GET_PEOPLE, UPDATE_CAR } from "../../graphql/queries";

const UpdateCar = ({ item, people, person, onCancel }) => {
  const [form] = Form.useForm();
  const [peopleOptions, setPeopleOptions] = useState([]);
  const [, forceUpdate] = useState();

  useEffect(() => {
    forceUpdate();
  }, []);

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

  const [updateCar, { loading }] = useMutation(UPDATE_CAR, {
    onCompleted: (data) => {
      form.resetFields();
      message.success("Car updated successfully!");
      console.log("Car updated successfully!", data);
      onCancel();
    },
    onError: (error) => {
      form.resetFields();
      message.error("Failed to update car.");
      console.log(JSON.stringify(error, null, 2));
    },
    refetchQueries: [{ query: GET_PEOPLE }],
  });

  const onFinish = async (values) => {
    updateCar({
      variables: {
        id: item.id,
        year: parseInt(values.year),
        make: values.make,
        model: values.model,
        price: parseFloat(values.price),
        personId: values.person,
      },
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Card style={{ marginBottom: "16px" }} title="Update Car" type="inner">
      <Form
        form={form}
        name="update-car-form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={formStyle}
        initialValues={{ ...item, person: person.id }}
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

        <Form.Item shouldUpdate={true}>
          {() => (
            <Button type="primary" htmlType="submit" loading={loading}>
              Update
            </Button>
          )}
        </Form.Item>

        <Form.Item>
          <Button
            type="default"
            htmlType="submit"
            loading={loading}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

const formStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
};

export default UpdateCar;
