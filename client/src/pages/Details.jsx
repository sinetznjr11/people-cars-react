import { useNavigate, useNavigation, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_PERSON_W_CARS } from "../graphql/queries";
import { Button, Card, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const Details = () => {
  const navigate = useNavigate();
  const { Paragraph } = Typography;
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PERSON_W_CARS, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { person } = data;

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>

      <Card
        title={`${person.firstName} ${person.lastName}`}
        style={{ marginTop: "32px" }}
      >
        {person.cars && person.cars.length > 0 ? (
          person.cars.map((car) => (
            <Card
              type="inner"
              title={`${car.make} ${car.model}`}
              style={{ marginBottom: "16px" }}
            >
              <Paragraph>Price: ${car.price}</Paragraph>
              <Paragraph>Year: {car.year}</Paragraph>
            </Card>
          ))
        ) : (
          <p>No cars</p>
        )}
      </Card>
    </div>
  );
};

export default Details;
