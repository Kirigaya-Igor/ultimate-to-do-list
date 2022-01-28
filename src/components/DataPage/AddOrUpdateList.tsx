import React, {FC, FormEvent, useState} from "react"
import {ModalWindow} from "../ModalWindow/ModalWindow";

type AddNewListTypes = {
    isActive: boolean
    setIsActive: (value: boolean) => void
    addList: (e: any) => void
    emptyListName: boolean
    clearData: () => void
    listName: string
    setListName: (value: string) => void
    setEmptyListName: (value: boolean) => void
    tasks: Array<{ name: string, isDone: boolean }>
    setTasks: (value: any) => void
    form1: string
    form2: string

}

export const AddOrUpdateList: FC<AddNewListTypes> =
    ({
         isActive, setIsActive, addList, emptyListName, clearData, listName,
         setListName, setEmptyListName, tasks, setTasks, form1, form2
     }) => {

        const [emptyTaskName, setEmptyTaskName] = useState<boolean>(false)
        const [taskName, setTaskName] = useState<string>('')
        const [isDone, setIsDone] = useState<boolean>(false)

        const addTask = (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            if (taskName === '') {
                setEmptyTaskName(true)
            } else {
                setEmptyTaskName(false)
                const newTask = {name: taskName, isDone}
                setTasks([...tasks, newTask])
                setTaskName('')
                setIsDone(false)
            }
        }

        const deleteSelectTasks = (e: any) => {
            e.preventDefault()
            setTasks(tasks.filter((item) => item.isDone !== true))
        }

        return (
            <ModalWindow isActive={isActive}>
                <div className='modalContent d-flex flex-column'>
                    <form onSubmit={addList} id={form1}></form>
                    <form onSubmit={addTask} id={form2}></form>

                    <input className={`modalListInput ${emptyListName ? 'borderRed' : ''}`}
                           name='listName' type='text' value={listName} placeholder='List name' form={form1}
                           onChange={(e) => {
                               setListName(e.target.value)
                               setEmptyListName(false)
                           }}
                    />

                    <hr className='dividingLine'/>

                    <div style={{minHeight: "150px", height: "350px", overflowY: "auto"}}>
                        {tasks.map((item, index) => (
                            <div key={index + Date.now()} className='modalItem'>
                                <label className="modalCheckbox">
                                    <input type="checkbox" checked={item.isDone} onChange={(e) => {
                                        // @ts-ignore
                                        setTasks(prevState => {
                                            const newState = [...prevState]
                                            newState[index] = {name: item.name, isDone: e.target.checked}
                                            return newState
                                        })
                                    }}/>
                                    <span></span>
                                </label>
                                <span className='modalTaskContent'>{item.name}</span>
                            </div>
                        ))}

                        <div className='modalItem'>
                            <label className="modalCheckbox">
                                <input type="checkbox"
                                       form={form2}
                                       checked={isDone}
                                       onChange={(e) => setIsDone(e.target.checked)}/>
                                <span></span>
                            </label>
                            <input className={`modalTaskInput ${emptyTaskName ? 'borderRed' : ''}`}
                                   type='text'
                                   form={form2}
                                   onChange={(e) => {
                                       setTaskName(e.target.value)
                                       setEmptyTaskName(false)
                                   }}
                                   value={taskName}
                                   placeholder='Task name'/>
                        </div>

                        <div className='buttons1'>
                            <button className='cancelButton' onClick={deleteSelectTasks}>CANCEL</button>
                            <button className='addButton' type='submit' form={form2}>ADD</button>
                        </div>
                    </div>

                    <div className='buttons2 mt-auto'>
                        <button className='cancelButton'
                                onClick={() => {
                                    setIsActive(false);
                                    clearData()
                                }}
                        >CANCEL</button>
                        {listName !== '' && tasks.length !== 0 ? <button className='saveButton' type='submit' form={form1}>SAVE</button> 
                        : <button disabled className='saveButton opacity-50' type='submit' form={form1}>SAVE</button> }
                    </div>
                </div>
            </ModalWindow>
        )
    }