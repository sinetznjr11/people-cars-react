import { gql } from "@apollo/client";

export const BASE_URL = "http://localhost:4000/graphql";

export const GET_PEOPLE = gql`
  query {
    people {
      id
      firstName
      lastName
      cars {
        id
        make
        model
        year
        price
      }
    }
  }
`;

export const GET_CARS = gql`
  query {
    cars {
      id
      year
      make
      model
      price
      person {
        id
        firstName
        lastName
      }
    }
  }
`;

export const GET_PERSON_W_CARS = gql`
  query GetPerson($id: ID!) {
    person(id: $id) {
      id
      firstName
      lastName
      cars {
        id
        year
        make
        model
        price
      }
    }
  }
`;

export const ADD_PERSON = gql`
  mutation AddPerson($firstName: String!, $lastName: String!) {
    addPerson(firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;

export const ADD_CAR = gql`
  mutation AddCar(
    $year: Int!
    $make: String!
    $model: String!
    $price: Float!
    $personId: ID!
  ) {
    addCar(
      year: $year
      make: $make
      model: $model
      price: $price
      personId: $personId
    ) {
      id
      year
      make
      model
      price
      person {
        id
        firstName
        lastName
      }
    }
  }
`;

export const DELETE_CAR = gql`
  mutation DeleteCar($id: ID!) {
    deleteCar(id: $id) {
      id
      make
      model
    }
  }
`;

export const DELETE_PERSON = gql`
  mutation DeletePerson($id: ID!) {
    deletePerson(id: $id) {
      id
    }
  }
`;

export const UPDATE_CAR = gql`
  mutation UpdateCar(
    $id: ID!
    $make: String!
    $model: String!
    $price: Float!
    $year: Int!
    $personId: ID!
  ) {
    updateCar(
      id: $id
      make: $make
      model: $model
      price: $price
      year: $year
      personId: $personId
    ) {
      id
      make
      model
      price
      year
      person {
        id
        firstName
        lastName
      }
    }
  }
`;

export const UPDATE_PERSON = gql`
  mutation UpdatePerson($id: ID!, $firstName: String, $lastName: String) {
    updatePerson(id: $id, firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;
