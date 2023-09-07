import React from 'react'
import { TaskContext } from '../context/taskContext'
import { useContext } from 'react'

const Home = () => {
  const {hello} = useContext(TaskContext)
  console.log(hello)
  return (
    <div>Hello world</div>
  )
}

export default Home