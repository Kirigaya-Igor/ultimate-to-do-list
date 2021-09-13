import React, {FC, FormEvent, useContext, useEffect, useState} from 'react'
import './dataPage.scss'
import {AddOrUpdateList} from "./AddOrUpdateList";
import {APIMethods, tasksType, toDoListType} from "../../API/API";
import {Redirect, useHistory} from "react-router-dom";
import queryString from "querystring";
import {FilterPanel} from "./FilterPanel";
import {Loader} from "../Loader/Loader";
import {AlertContext} from "../alert/alertState";
import {catchError} from "../common/catchError";

type QueryParamsType = { _sort?: string }

export const DataPage: FC = () => {

    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [addIsActive, setAddIsActive] = useState<boolean>(false)
    const [updateIsActive, setUpdateIsActive] = useState<boolean>(false)
    const [emptyListName, setEmptyListName] = useState<boolean>(false)
    const [listName, setListName] = useState<string>('')
    const [toDoList, setToDoList] = useState<Array<toDoListType>>([])
    const [helpToDoList, setHelpToDoList] = useState<Array<toDoListType>>([])
    const [tasks, setTasks] = useState<Array<tasksType>>([])
    const [activePage, setActivePage] = useState<boolean>(true)
    const [selectItem, setSelectItem] = useState<toDoListType>({} as toDoListType)
    const [sortType, setSortType] = useState<string>('created_at')
    const [searchText, setSearchText] = useState<string>('')
    const history = useHistory()
    // @ts-ignore
    const {showAlert} = useContext(AlertContext);

    const getData = (sortType?: string) => {
        APIMethods.getToDoList(sortType)
            .then((res) => {
                setToDoList(res.data)
                setHelpToDoList(res.data)
                setIsLoading(false)
            })
            .catch((error) => {
                setIsLoading(false)
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
        const parsed = queryString.parse(history.location.search.substr(1)) as QueryParamsType
        if (!!parsed._sort) setSortType(parsed._sort)
    }, [])

    useEffect(() => {
        if (activePage && localStorage.getItem('token')) {
            getData(sortType)
        }
        return () => setActivePage(false)
    }, [activePage, sortType])

    useEffect(() => {
        if (localStorage.getItem('token')) {
            const query: QueryParamsType = {}
            query._sort = sortType
            history.push({
                pathname: '/main',
                search: queryString.stringify(query)
            })
        }
    }, [sortType, history])

    useEffect(() => {
        searchTitle(searchText)
    }, [searchText])

    if (!localStorage.getItem('token')) {
        return <Redirect to="/login"/>;
    }

    const clearData = () => {
        setListName('')
        setTasks([])
    }

    const addOrUpdateList = async (apiMethod: any, id?: number) => {
        if (listName === '') {
            setEmptyListName(true)
        } else {
            setEmptyListName(false)
            const newList = {name: listName, task: tasks}
            try {
                await apiMethod(newList, id && id)
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
            APIMethods.deleteList(id)
                .then(() => {
                    setToDoList(toDoList.filter((item) => item.id !== id))
                    setHelpToDoList(helpToDoList.filter((item) => item.id !== id))
                    setIsLoading(false)
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
                             clearData={clearData} form1='form1' form2='form2'/>

            <AddOrUpdateList isActive={updateIsActive} setIsActive={setUpdateIsActive} addList={updateList}
                             emptyListName={emptyListName} listName={listName} setListName={setListName}
                             setEmptyListName={setEmptyListName} tasks={tasks} setTasks={setTasks}
                             clearData={clearData} form1='form3' form2='form4'/>

            <div className='container-fluid'>
                <div className='row text-white d-flex justify-content-center align-items-start'>

                    <FilterPanel sortType={sortType} setSortType={setSortType}
                                 setActivePage={setActivePage} setIsLoading={setIsLoading} searchText={searchText}
                                 setSearchText={setSearchText}/>

                    {isLoading ? <Loader/> : helpToDoList.map((item) => {
                            const created = item.created_at
                            const date = `${created.slice(8, 10)}-${created.slice(5, 7)}-${created.slice(0, 4)}`
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
                                        <div className='col-lg-3'>{`Created at: ${date}`}</div>
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
                <button className='addListButton' onClick={() => setAddIsActive(true)}></button>
            </div>
        </div>
    )
}