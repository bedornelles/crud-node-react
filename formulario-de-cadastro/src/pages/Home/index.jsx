import { useEffect, useState, useRef } from 'react'
import './style.css'
import Trash from '../../assets/trash.svg'
import PencilEdit from '../../assets/pencil-square.svg'
import api from '../../services/api'

function Home() {

  const [users, setUsers] = useState([])
  const [editingUser, setEditingUser] = useState(null) //guarda o usuário em edição

  const inputName = useRef()
  const inputAge = useRef()
  const inputEmail = useRef()

  //chama
  async function getUsers() {
    const usersFromApi = await api.get('/usuarios')

    setUsers(usersFromApi.data)
  }

  //cria
  async function createUsers() {
    await api.post('/usuarios', {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value
    })
    // limpa os campos depois de salvar
    inputName.current.value = ""
    inputAge.current.value = ""
    inputEmail.current.value = ""
    getUsers()
  }

  // inicia edição preenchendo os campos
  function startEditing(user) {
    inputName.current.value = user.name
    inputAge.current.value = user.age
    inputEmail.current.value = user.email
    setEditingUser(user)
  }

  // salva edição
  async function updateUser() {
    await api.put(`/usuarios/${editingUser.id}`, {
      name: inputName.current.value,
      age: inputAge.current.value,
      email: inputEmail.current.value
    })
    inputName.current.value = ""
    inputAge.current.value = ""
    inputEmail.current.value = ""
    setEditingUser(null)

    getUsers()
  }

  //deleta
  async function deleteUsers(id) {
    await api.delete(`/usuarios/${id}`)

    getUsers()
  }

  useEffect(() => {
    getUsers()
  }, [])


  //html
  return (

    <div className='container'>
      <form action="">
        <h1>Cadastro de usuários</h1>
        <input placeholder='Nome' name='nome' type="text" ref={inputName} />
        <input placeholder='Idade' name='idade' type="number" ref={inputAge} />
        <input placeholder='E-mail' name='email' type="email" ref={inputEmail} />
        <button
          type='button'
          onClick={editingUser ? updateUser : createUsers}
        >
          {editingUser ? "Salvar edição" : "Cadastrar"}
        </button>
      </form>

      {users.map(user => (
        <div key={user.id} className='card'>
          <div>
            <p>Nome: <span> {user.name} </span> </p>
            <p>Idade: <span> {user.age} </span> </p>
            <p>Email: <span> {user.email} </span> </p>
          </div>
          <div className="actions">
            <button onClick={() => startEditing(user)}>
              <img src={PencilEdit} alt="" />
            </button>
            <button onClick={() => deleteUsers(user.id)}>
              <img src={Trash} alt="Deletar" />
            </button>
          </div>
        </div>
      ))}


    </div>

  )
}

export default Home
