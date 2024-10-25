import { Button, Divider, Form, Input, message } from "antd";
import { useMutation } from "@apollo/client";
import { ADD_PERSON, GET_PEOPLE } from "../../graphql/queries";
import { useEffect, useState } from "react";

const AddPerson = () => {
  const [addPerson, { loading }] = useMutation(ADD_PERSON, {
    onCompleted: (data) => {
      resetForm();
      message.success("Person added successfully!");
      console.log("Person added successfully!", data);
    },
    onError: (error) => {
      resetForm();
      message.error("Failed to add person.");
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
      await addPerson({
        variables: {
          firstName: values.firstName,
          lastName: values.lastName,
        },
        update: (cache, { data: { addPerson } }) => {
          const data = cache.readQuery({ query: GET_PEOPLE });
          cache.writeQuery({
            query: GET_PEOPLE,
            data: {
              ...data,
              people: [
                ...data.people,
                {
                  ...addPerson,
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
    <div style={{ marginBottom: "36px" }}>
      <Divider>Add Person</Divider>

      <Form
        form={form}
        name="add-person-form"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={formStyle}
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
            Add Person
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
  gap: ".5rem",
};

export default AddPerson;
