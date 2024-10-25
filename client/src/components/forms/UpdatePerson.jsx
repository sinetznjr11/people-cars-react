import { Button, Card, Divider, Form, Input, message } from "antd";
import { useMutation } from "@apollo/client";
import { GET_PEOPLE, UPDATE_PERSON } from "../../graphql/queries";
import { useEffect, useState } from "react";

const UpdatePerson = ({ person, onCancel }) => {
  const [updatePerson, { loading }] = useMutation(UPDATE_PERSON, {
    onCompleted: (data) => {
      resetForm();
      message.success("Person updated successfully!");
      console.log("Person updated successfully!", data);
      onCancel();
    },
    onError: (error) => {
      resetForm();
      message.error("Failed to update person.");
      console.error("Error onError:", error);
      console.error(JSON.stringify(error));
    },
  });

  const [form] = Form.useForm();

  const [, forceUpdate] = useState();

  useEffect(() => {
    forceUpdate();
  }, []);

  const onFinish = async (values) => {
    try {
      await updatePerson({
        variables: {
          id: person.id,
          firstName: values.firstName,
          lastName: values.lastName,
        },
        update: (cache, { data: { updatePerson } }) => {
          const data = cache.readQuery({ query: GET_PEOPLE });
          cache.writeQuery({
            query: GET_PEOPLE,
            data: {
              ...data,
              people: [
                ...data.people,
                {
                  ...updatePerson,
                  cars: [],
                },
              ],
            },
          });
        },
      });
    } catch (error) {
      message.error("Something went wrong!");
      console.error("Error onFinish:", error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed onFinishFailed:", errorInfo);
  };

  const resetForm = () => form.resetFields();

  return (
    <Card title="Update Person" style={{ marginBottom: "36px" }}>
      <Form
        form={form}
        name="update-person-form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={formStyle}
        initialValues={person}
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[
            {
              required: true,
              message: "Please input your first name!",
            },
          ]}
        >
          <Input placeholder="First Name" />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            {
              required: true,
              message: "Please input your last name!",
            },
          ]}
        >
          <Input placeholder="Last Name" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </Form.Item>

        <Form.Item>
          <Button onClick={onCancel}>Cancel</Button>
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
  gap: ".5rem",
};

export default UpdatePerson;
