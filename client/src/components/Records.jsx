import { Divider, Typography } from "antd";
import Person from "./items/Person";

const Records = ({ people }) => {
  const { Title, Paragraph } = Typography;
  return (
    <div>
      <Divider>Records</Divider>
      {people.length === 0 ? (
        <Paragraph>No people to display</Paragraph>
      ) : (
        people.map((person) => (
          <Person key={person.id} person={person} people={people} />
        ))
      )}
    </div>
  );
};

export default Records;
