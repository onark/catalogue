import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import catService from './services/cats'
import './index.css'

const Cat = ({ cat, selectedCat, selectCat }) => {
  return (
    <tr className={cat === selectedCat ? 'selected' : ''} onClick={() => selectCat(cat)}>
      <td>{cat.id}</td>
      <td>{cat.name}</td>
      <td>{cat.breed}</td>
      <td>{cat.weight}</td>
    </tr>
  )
}

const Notification = ({ message }) => {
  if (!message) {
    return null
  } else {
    return (
      <div className='notification'>
        <p className={message.includes('error') ? 'notification error' : 'notification success'}>{message}</p>
      </div>
    )
  }
}

const Search = ({ searchValue, onSearchTextChange }) => {
  return (
    <form className='search-wrapper'>
      <div className='search'>
        <label htmlFor="search">Search by name:</label>
        <input
          value={searchValue}
          onChange={onSearchTextChange} />
      </div>
    </form>
  )
}

const Form = ({ addCat, name, changeName, breed, changeBreed, weight, changeWeight, updateCat, removeCat, closeForm }) => {
  return (
    <form className='form-wrapper'>
      <button className='close-form-button' onClick={closeForm}>X</button>
      <h2>Edit or add new cat</h2>
      <div className='form-field'>
        <label htmlFor="name">Name:</label>
        <input
          value={name}
          placeholder="required"
          onChange={changeName} />
      </div>
      <div className='form-field'>
        <label htmlFor="breed">Breed:</label>
        <input
          value={breed}
          placeholder="required"
          onChange={changeBreed} />
      </div>
      <div className='form-field'>
        <label htmlFor="weight">Weight:</label>
        <input
          value={weight}
          placeholder="optional"
          onChange={changeWeight} />
      </div>
      <div className='form-buttons'>
        <button onClick={addCat}>Save New</button>
        <button onClick={updateCat}>Save</button>
        <button onClick={removeCat}>Delete</button>
      </div>
    </form>
  )
}

const App = () => {
  const [cats, setCats] = useState([]);
  const [newName, setNewName] = useState('');
  const [searchText, setSearchText] = useState('');
  const [newBreed, setNewBreed] = useState('');
  const [newWeight, setNewWeight] = useState('');
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedCat, setSelectedCat] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await catService.getAll();
        setCats(response.data);
      } catch (error) {
        // handle error
      }
    }
    fetchData();
  }, []);

  const updateCat = async (event) => {
    event.preventDefault();
    const newCatObject = {
      name: newName,
      breed: newBreed,
      weight: newWeight
    }
    try {
      const response = await catService.update(selectedCat.id, newCatObject);
      setCats(cats.map(cat => cat.id !== selectedCat.id ? cat : response.data));
      setSuccessMessage(`${selectedCat.name} is updated`);
      setTimeout(() => {
        setSuccessMessage(null)
      }, 3000);
    } catch (error) {
      setErrorMessage(`error: ${error.response.data.error}`);
      console.log(error.response.data.error);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
    setNewName('');
    setNewBreed('');
    setNewWeight(null);
  };
  
const addCat = async (event) => {
  event.preventDefault();
  const catObject = {
    name: newName,
    breed: newBreed,
    weight: newWeight
  }
  try {
    const response = await catService.create(catObject);
    setCats(cats.concat(response.data));
    setSuccessMessage(`${catObject.name} is added`);
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000);
    return response;
  } catch (error) {
    setErrorMessage(`error: ${error.response.data.error}`);
    console.log(error.response.data.error);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }
  setNewName('');
  setNewBreed('');
  setNewWeight(null);
};

const deleteCat = async () => {
  if (window.confirm(`Do you really want to delete ${selectedCat.name}?`)) {
    try {
      await catService.deleteCat(selectedCat.id);
      setCats(cats.search(cat => cat.id !== selectedCat.id));
    } catch (error) {
      setErrorMessage(`error deleting cat ${selectedCat.name}`);
      console.log(error.response.data.error);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  }
};

  const searchedCats = cats.filter(cat => cat.name.toLowerCase().indexOf(searchText) > -1)

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleBreedChange = (event) => {
    setNewBreed(event.target.value)
  }

  const handleWeightChange = (event) => {
    setNewWeight(event.target.value)
  }

  const handleCatSelect = (cat) => {
    setSelectedCat(cat);
    setNewName(cat.name)
    setNewBreed(cat.breed)
    setNewWeight(cat.weight)
  }

  const closeForm = () => {
    setNewName('');
    setNewBreed('');
    setNewWeight(null);
    setSelectedCat(null);
  }

  return (
    <div className='main-container'>
      <Notification message={successMessage || errorMessage} />
      <h2>🐈Catalogue🐈</h2>
      <div className='content-container'>
        <div className='cats-container'>
          <h2>Cats</h2>
          <div className='search'>
            <Search searchValue={searchText} onSearchTextChange={handleSearchTextChange} />
          </div>
          <table className='cats-table'>
            <thead className='cats-head'>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Breed</th>
                <th>Weight</th>
              </tr>
            </thead>
            <tbody className='cats-body'>
              {searchedCats.map(cat =>
                <Cat cat={cat} key={cat.id} selectCat={handleCatSelect} selectedCat={selectedCat} />
              )}
            </tbody>
          </table>
        </div>
        {selectedCat && (
          <div className='form-container'>
            <Form
              name={newName} changeName={handleNameChange}
              breed={newBreed} changeBreed={handleBreedChange}
              weight={newWeight} changeWeight={handleWeightChange}
              addCat={addCat}
              removeCat={() => deleteCat(selectedCat)}
              updateCat={updateCat}
              closeForm={closeForm}
            />
          </div>
        )}
      </div>
    </div>
  )
}
createRoot(document.getElementById('root')).render(<App />)
