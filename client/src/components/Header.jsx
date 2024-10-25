import { Divider, Typography } from "antd";
const { Title } = Typography;

const Header = () => {
  const styles = getStyles();
  return (
    <header style={styles.header}>
      <Title level={2}>People and Their Cars</Title>
      <Divider />
    </header>
  );
};

const getStyles = () => ({
  header: {
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: "36px",
  },
});

export default Header;
