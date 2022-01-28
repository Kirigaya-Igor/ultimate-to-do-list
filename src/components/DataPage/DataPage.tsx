import React, { FC, FormEvent, useContext, useEffect, useState } from 'react'
import './dataPage.scss'
import { AddOrUpdateList } from "./AddOrUpdateList";
import { APIMethods, tasksType, toDoListType } from "../../API/API";
import { FilterPanel } from "./FilterPanel";
import { Loader } from "../Loader/Loader";
import { AlertContext } from "../alert/alertState";
import { catchError } from "../common/catchError";
import { Redirect } from 'react-router-dom';
import { FirebaseContext } from '../Firebase/FirebaseProvider';

export const DataPage: FC = () => {

    const [dbIsEmpty, setDbIsEmpty] = useState<boolean>(true)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [addIsActive, setAddIsActive] = useState<boolean>(false)
    const [updateIsActive, setUpdateIsActive] = useState<boolean>(false)
    const [emptyListName, setEmptyListName] = useState<boolean>(false)
    const [listName, setListName] = useState<string>('')
    const [toDoList, setToDoList] = useState<Array<toDoListType>>([])
    const [helpToDoList, setHelpToDoList] = useState<Array<toDoListType>>([])
    const [tasks, setTasks] = useState<Array<tasksType>>([])
    const [selectItem, setSelectItem] = useState<toDoListType>({} as toDoListType)
    const [searchText, setSearchText] = useState<string>('')
    // @ts-ignore
    const { showAlert } = useContext(AlertContext)
    // @ts-ignore
    const {currentUser} = useContext(FirebaseContext)

    const getData = () => {
        APIMethods.getToDoList(currentUser.uid)
            .then((res) => {
                if (res.data !== null) {
                    const appData = Object.keys(res.data).map(key => {
                        return {
                            //@ts-ignore
                            ...res.data[key],
                            id: key
                        }
                    })
    
                    setToDoList(appData)
                    setHelpToDoList(appData)
                    setIsLoading(false)
                    setDbIsEmpty(false)
                } else if (res.data === null) {
                    setIsLoading(false)
                    setDbIsEmpty(true)
                }
                
            })
            .catch((error) => {
                setIsLoading(false)
                console.log(error)
                catchError(error, showAlert)
            })
    }

    const searchTitle = (searchValue: string) => {
        let helpArray = toDoList
        helpArray = helpArray.filter((item) => {
            return item.name.toLowerCase().search(searchValue.toLowerCase()) !== -1
        })
        setHelpToDoList(helpArray)
    }

    useEffect(() => {
        currentUser && getData()
        return () => {
            setToDoList([])
            setHelpToDoList([])
        };
    }, [currentUser])

    useEffect(() => {
        searchTitle(searchText)
    }, [searchText])

    const clearData = () => {
        setListName('')
        setTasks([])
    }

    if (!localStorage.getItem('userId')) {
        return <Redirect to="/login" />;
    }

    const addOrUpdateList = async (apiMethod: any, id?: number) => {
        if (listName === '') {
            setEmptyListName(true)
        } else {
            setEmptyListName(false)
            let today = new Date()
            const newList = { name: listName, task: tasks, created: today.toISOString().split('T')[0].split("-").reverse().join(".") }
            try {
                currentUser && await apiMethod(currentUser.uid, newList, id && id)
                getData()
                clearData()
            } catch (error: any) {
                setIsLoading(false)
                if (error.response) {
                    showAlert(error.response.data)
                } else {
                    showAlert(`Some error has occurred, please try again. Error message: ${error.message}`)
                }
            }
        }
    }

    const addList = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setAddIsActive(false)
        await addOrUpdateList(APIMethods.addList)
    }

    const updateList = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setUpdateIsActive(false)
        setSearchText('')
        await addOrUpdateList(APIMethods.updateList, selectItem.id)
        setSelectItem({} as toDoListType)
    }

    const deleteList = async (id: number) => {
        try {
            setIsLoading(true)
            currentUser && APIMethods.deleteList(currentUser.uid, id)
                .then(() => {
                    setToDoList(toDoList.filter((item) => item.id !== id))
                    setHelpToDoList(helpToDoList.filter((item) => item.id !== id))
                    setIsLoading(false)
                    if (helpToDoList.length === 1) setDbIsEmpty(true)
                })
                .catch((error) => {
                    setIsLoading(false)
                    catchError(error, showAlert)
                })
        } catch (error: any) {
            setIsLoading(false)
            showAlert(`Some error has occurred, please try again. Error message: ${error.message}`)
        }
    }

    return (
        <div className='dataPage'>
            <AddOrUpdateList isActive={addIsActive} setIsActive={setAddIsActive} addList={addList}
                emptyListName={emptyListName} listName={listName} setListName={setListName}
                setEmptyListName={setEmptyListName} tasks={tasks} setTasks={setTasks}
                clearData={clearData} form1='form1' form2='form2' />

            <AddOrUpdateList isActive={updateIsActive} setIsActive={setUpdateIsActive} addList={updateList}
                emptyListName={emptyListName} listName={listName} setListName={setListName}
                setEmptyListName={setEmptyListName} tasks={tasks} setTasks={setTasks}
                clearData={clearData} form1='form3' form2='form4' />

            <div className='container-fluid'>
                <div className='row text-white d-flex justify-content-center align-items-start'>

                    <FilterPanel searchText={searchText} setSearchText={setSearchText} />

                    {isLoading ? <Loader /> : dbIsEmpty ? <h1 className='text-white text-center'>Your to-do list is empty</h1> : helpToDoList.map((item) => {
                        let helpArray = []
                        item.task.forEach((i) => {
                            if (i.isDone === true) {
                                helpArray.push(i)
                            }
                        })
                        const allT = item.task.length
                        const completedT = helpArray.length
                        const UncompletedT = allT - completedT
                        return (
                            <div key={item.id} className='col-md-8 container-fluid'
                                onClick={() => {
                                    setUpdateIsActive(true)
                                    setSelectItem(item)
                                    setListName(item.name)
                                    setTasks(item.task)
                                }}>
                                <div className='row dataItem d-lg-flex justify-content-between align-items-center'>
                                    <div className='col-lg-3'>{item.name}</div>
                                    <div className='col-lg-3'>{`Created at: ${item.created}`}</div>
                                    <div
                                        className='col-lg-5'>{`Completed: ${completedT}, Uncompleted: ${UncompletedT}, All: ${allT}`}</div>
                                    <div className='col-lg-1'>
                                        <button className='deleteButton' onClick={(e) => {
                                            e.stopPropagation()
                                            deleteList(item.id)
                                        }}>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
                <div className='row d-flex justify-content-center'>
                    <div className='col-md-8 position-relative'>
                        <button className='addListButton' onClick={() => setAddIsActive(true)}></button>
                    </div>
                </div>

            </div>
        </div>
    )
}