import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './contact.css'
import ReadOnlyRow from './components/ReadOnlyRow'
import EditableRow from './components/EditableRow'

function ContactUs() {
    const [userData, setUserData] = useState([])
    const [addFormData, setAddFormData] = useState({
      name: '',
      phoneNumber: '',
      email: ''
    })
    const [editUserId, setEditUserId] = useState(null)
    const [editFormData, setEditFormData] = useState({
      name: '',
      phoneNumber: '',
      email: ''
    })

    useEffect(() => {
      axios.get('http://localhost:3001/users')
      .then(response => {
          setUserData(response.data)
      })
    }, [])

    const handleEditFormChange = (event) => {
      event.preventDefault()

      const fieldName = event.target.getAttribute('name')
      const fieldValue = event.target.value

      const newEditFormData = {...editFormData}
      newEditFormData[fieldName] = fieldValue

      setEditFormData(newEditFormData)
    }

    const handleAddFormChange = (event) => {
      event.preventDefault()

      const fieldName = event.target.getAttribute('name')
      const fieldValue = event.target.value

      const newFormData = {...addFormData}
      newFormData[fieldName] = fieldValue

      setAddFormData(newFormData)
    }

    const handleAddFormSubmit = (event) => {
      event.preventDefault()

      const newUser = {
        id: userData.length + 1,
        name: addFormData.name,
        phoneNumber: addFormData.phoneNumber,
        email: addFormData.email
      }

      const newUserData = [...userData, newUser]
      console.log(newUserData)
      setUserData(newUserData)

      document.getElementById('submit-form').reset()

      axios.post('http://localhost:3001/save', newUserData[newUserData.length - 1])
      .then(res => {
        console.log(res.data)
      })
    }

    const handleEditClick = (event, userData) => {
      event.preventDefault()

      setEditUserId(userData.id)
      
      const formValues = {
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        email: userData.email
      }
      setEditFormData(formValues)
    }

    const handleCancelClick = () => {
      setEditUserId(null)
    }

    const handleEditFormSubmit = (event) => {
      event.preventDefault()

      const editedUser = {
        id: editUserId,
        name: editFormData.name,
        phoneNumber: editFormData.phoneNumber,
        email: editFormData.email
      }

      const newUserData = [...userData]
      const index = userData.findIndex((user) => user.id === editUserId)
      newUserData[index] = editedUser
      setUserData(newUserData)

      axios.put('http://localhost:3001/update', newUserData[index])

      setEditUserId(null)
    }

    const handleDeleteUserClick = async (userId) => {
      const deleteUserData = [...userData]
      const index = userData.findIndex((user) => user.id === userId)
      deleteUserData.splice(index, 1)
      console.log(deleteUserData)
      setUserData(deleteUserData)

      await axios.delete('http://localhost:3001/delete', {
        data: {
          id: userId
        }
      })      
    }

  return (
    <div>
    <h1 className='title'>User Table</h1>
    <div className='user-container'>      
      <div className='table-div'>
        <form key='form-table' onSubmit={handleEditFormSubmit}>
          <table key='table' className='table'>
            <thead>
              <tr className='head'>
                <th key='name'>Name</th>
                <th key='phone'>Phone #</th>
                <th key='email'>Email</th>
                <th key='action'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user, i) => (
                <>
                {editUserId === user.id ? 
                (<EditableRow 
                  key={i}
                  editFormData={editFormData} 
                  handleEditFormChange={handleEditFormChange}
                  handleCancelClick={handleCancelClick}  />
                ) : (
                <ReadOnlyRow 
                  key={i} 
                  user={user}
                  handleEditClick={handleEditClick}
                  handleDeleteUserClick={handleDeleteUserClick} />
                )}
                </>
              ))}                  
            </tbody>
          </table>
        </form>      
      </div>
      <div key='div-add' className='addUser-div'>
        <h3 id='add-user'>Add a user</h3>
        <form key='form-add' id='submit-form' onSubmit={handleAddFormSubmit}>
          <input 
            key='1'
            type='text' 
            name='name' 
            required='required' 
            placeholder='Enter Name...'
            onChange={handleAddFormChange}
          />
          <input 
            key='2'
            type='text' 
            name='phoneNumber' 
            required='required' 
            placeholder='Enter phone: (###)###-####'
            onChange={handleAddFormChange}
          />
          <input 
            key='3'
            type='email' 
            name='email' 
            required='required' 
            placeholder='Enter Email...' 
            onChange={handleAddFormChange}
          />
          <button key='btn-add' type='submit'> Add </button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default ContactUs