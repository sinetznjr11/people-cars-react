import { Typography } from "antd";

const { Paragraph } = Typography;

const Footer = () => {
  const styles = getStyles();
  return (
    <footer style={styles.footer}>
      <Paragraph style={{ margin: 0 }}>
        © {new Date().getFullYear()} Sinet Thapa. WMDD4950.
      </Paragraph>
    </footer>
  );
};

const getStyles = () => ({
  footer: {
    marginTop: "32px",
    textAlign: "center",
    padding: "16px",
    color: "#333",
  },
});

export default Footer;
