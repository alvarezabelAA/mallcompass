import React from 'react'
import { TaskContext } from '../context/taskContext'
import { useContext } from 'react'
import FormLogin from '../components/login/FormLogin'

const Home = () => {
  const { hello } = useContext(TaskContext)
  console.log(hello)
  return (
    <FormLogin />
    
  )
}

export default Home