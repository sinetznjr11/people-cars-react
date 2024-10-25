import find from "lodash.find";
import remove from "lodash.remove";

const people = [
  {
    id: "1",
    firstName: "Bill",
    lastName: "Gates",
  },
  {
    id: "2",
    firstName: "Steve",
    lastName: "Jobs",
  },
  {
    id: "3",
    firstName: "Linux",
    lastName: "Torvalds",
  },
];

const cars = [
  {
    id: "1",
    year: "2019",
    make: "Toyota",
    model: "Corolla",
    price: "40000",
    personId: "1",
  },
  {
    id: "2",
    year: "2018",
    make: "Lexus",
    model: "LX 600",
    price: "13000",
    personId: "1",
  },
  {
    id: "3",
    year: "2017",
    make: "Honda",
    model: "Civic",
    price: "20000",
    personId: "1",
  },
  {
    id: "4",
    year: "2019",
    make: "Acura ",
    model: "MDX",
    price: "60000",
    personId: "2",
  },
  {
    id: "5",
    year: "2018",
    make: "Ford",
    model: "Focus",
    price: "35000",
    personId: "2",
  },
  {
    id: "6",
    year: "2017",
    make: "Honda",
    model: "Pilot",
    price: "45000",
    personId: "2",
  },
  {
    id: "7",
    year: "2019",
    make: "Volkswagen",
    model: "Golf",
    price: "40000",
    personId: "3",
  },
  {
    id: "8",
    year: "2018",
    make: "Kia",
    model: "Sorento",
    price: "45000",
    personId: "3",
  },
  {
    id: "9",
    year: "2017",
    make: "Volvo",
    model: "XC40",
    price: "55000",
    personId: "3",
  },
];

const typeDefs = `
  type Person {
    id: ID!
    firstName: String!
    lastName: String!
    cars: [Car]
  }

  type Car {
    id: ID!
    year: Int!
    make: String!
    model: String!
    price: Float!
    person: Person!
  }

  type Query {
    people: [Person]
    person(id: ID!): Person
    cars: [Car]
    car(id: ID!): Car
  }

  type Mutation {
    addPerson(firstName: String!, lastName: String!): Person
    updatePerson(id: ID!, firstName: String, lastName: String): Person
    deletePerson(id: ID!): Person

    addCar(year: Int!, make: String!, model: String!, price: Float!, personId: ID!): Car
    updateCar(id: ID!, year: Int, make: String, model: String, price: Float, personId: ID): Car
    deleteCar(id: ID!): Car
  }
`;

const resolvers = {
  Query: {
    people: () => people,
    person: (_, { id }) => find(people, (person) => person.id === id),
    cars: () => cars,
    car: (_, { id }) => find(cars, (car) => car.id === id),
  },
  Person: {
    cars: (parent) => cars.filter((car) => car.personId === parent.id),
  },
  Car: {
    person: (parent) => find(people, (person) => person.id === parent.personId),
  },

  Mutation: {
    // People mutations
    addPerson: (_, { firstName, lastName }) => {
      const newPerson = {
        id: String(people.length + 1),
        firstName,
        lastName,
      };
      people.push(newPerson);
      return newPerson;
    },
    updatePerson: (_, { id, firstName, lastName }) => {
      const person = find(people, (person) => person.id === id);
      if (!person) return null;
      if (firstName !== undefined) person.firstName = firstName;
      if (lastName !== undefined) person.lastName = lastName;
      return person;
    },
    deletePerson: (_, { id }) => {
      const person = find(people, (person) => person.id === id);
      if (!person) return null;

      remove(people, (p) => p.id === id);
      remove(cars, (car) => car.personId === id);
      return person;
    },

    // Car mutations
    addCar: (_, { year, make, model, price, personId }) => {
      const newCar = {
        id: String(cars.length + 1),
        year,
        make,
        model,
        price,
        personId,
      };
      cars.push(newCar);
      return newCar;
    },
    updateCar: (_, { id, year, make, model, price, personId }) => {
      const car = find(cars, (car) => car.id === id);
      if (!car) return null;
      if (year !== undefined) car.year = year;
      if (make !== undefined) car.make = make;
      if (model !== undefined) car.model = model;
      if (price !== undefined) car.price = price;
      if (personId !== undefined) car.personId = personId;
      return car;
    },
    deleteCar: (_, { id }) => {
      const car = find(cars, (car) => car.id === id);
      if (!car) return null;
      remove(cars, (c) => c.id === id);
      return car;
    },
  },
};

export { typeDefs, resolvers };
