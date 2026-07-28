import { useState } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import { useEffect } from "react";
import phoneService from "./services/phonebook";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filteredName, setFilteredName] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);

  const showNotification = (message, successful) => {
    setNotificationMessage({ message, successful });
    setTimeout(() => {
      setNotificationMessage(null);
    }, 3000);
  };

  useEffect(() => {
    phoneService.getAll().then((initialPersons) => setPersons(initialPersons));
  }, []);

  const updatePerson = (id, updatedPerson) => {
    phoneService
      .updatePerson(id, updatedPerson)
      .then((returnedPerson) => {
        setPersons((prevPersons) =>
          prevPersons.map((person) =>
            person.id === id ? returnedPerson : person,
          ),
        );
        showNotification(
          `Updated phone number for ${updatedPerson.name}`,
          true,
        );
      })
      .catch(() => {
        showNotification(
          `Information of ${updatedPerson.name} has already been deleted from server`,
          false,
        );

        setPersons((prevPersons) =>
          prevPersons.filter((person) => person.id !== id),
        );
      });
  };

  const addPerson = (event) => {
    event.preventDefault();
    const person = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase(),
    );
    if (
      person &&
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`,
      )
    ) {
      const updatedPerson = { ...person, number: newNumber };
      updatePerson(person.id, updatedPerson);

      setNewName("");
      setNewNumber("");
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };

      phoneService.create(newPerson).then((returnedPerson) => {
        setPersons((prevPersons) => prevPersons.concat(returnedPerson));
        showNotification(`Added ${returnedPerson.name}`, true);
      });

      setNewName("");
      setNewNumber("");
    }
  };
  const filteredPeople = persons.filter((person) =>
    person.name.toLowerCase().includes(filteredName.toLowerCase()),
  );

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      phoneService.deletePerson(id).then(() => {
        setPersons((prevPersons) =>
          prevPersons.filter((person) => person.id !== id),
        );
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Filter value={filteredName} onChange={setFilteredName} />
      <h3>add a new</h3>
      <PersonForm
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        addPerson={addPerson}
      />

      <h3>Numbers</h3>
      <Persons filteredPeople={filteredPeople} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
