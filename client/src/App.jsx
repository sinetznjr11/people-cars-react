import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Details from "./pages/Details";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="people/:id" element={<Details />} />
          </Route>
        </Routes>
      </Router>
    </ApolloProvider>
  );
};

export default App;
