import axios, { AxiosResponse } from "axios"

export type dataType = {
    config: any
    data: Array<toDoListType>
    headers: any
    request: any
    status: number
    statusText: string
}
export type tasksType = {
    name: string,
    isDone: boolean
}
export type toDoListType = {
    id: number
    name: string
    created: string
    task: Array<tasksType>
}

const url = 'https://ultimate-to-do-ea1f8-default-rtdb.europe-west1.firebasedatabase.app'

export const APIMethods = {
    getToDoList(userId: string): Promise<AxiosResponse<Array<toDoListType>>> {
        return axios.get(`${url}/${userId}/to-do-list.json`)
    },

    addList(userId: string, newList: { name: string, task: Array<object> }) {
        return axios.post(`${url}/${userId}/to-do-list.json`, newList)
    },

    updateList(userId: string, newList: { name: string, task: Array<object> }, id: number): Promise<AxiosResponse<dataType>> {
        return axios.put(`${url}/${userId}/${id}.json`, newList)
    },

    deleteList(userId: string, id: number): Promise<AxiosResponse> {
        return axios.delete(`${url}/${userId}/to-do-list/${id}.json`)
    }
}