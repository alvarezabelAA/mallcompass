import { createContext } from "react";

export const TaskContext = createContext()

export const TaskProvider = ({children}) => {

    let hello = 'world'

    return (
        <TaskContext.Provider value={{hello}}>
            {children}
        </TaskContext.Provider>

    )
}