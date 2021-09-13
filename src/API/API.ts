import axios, {AxiosResponse} from "axios"

export type dataType = {
    config: any
    data: {
        created_at: string
        id: number
        name: string
        published_at: string
        task: Array<object>
        updated_at: string
        user: any
    }
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
    user: any
    published_at: string
    created_at: string
    updated_at: string
    task: Array<tasksType>
}

export const instance = axios.create({
    baseURL: 'https://recruitment.ultimate.systems/',
})

instance.interceptors.request.use(config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

export const APIMethods = {
    login(userData: {identifier: string, password: string}): Promise<AxiosResponse> {
        return axios.post('https://recruitment.ultimate.systems/auth/local', userData)
    },

    register(newUser: {username: string, email: string, password: string}) : Promise<AxiosResponse> {
        return axios.post('https://recruitment.ultimate.systems/auth/local/register', newUser)
    },

    getToDoList(sortType?: string) : Promise<AxiosResponse<Array<toDoListType>>> {
        return instance.get(`to-do-lists${sortType ? '?_sort=' + sortType : ''}`)
    },

    addList(newList: {name: string, task: Array<object>}) : Promise<AxiosResponse<dataType>> {
        return instance.post('to-do-lists', newList)
    },

    updateList(newList: {name: string, task: Array<object>}, id: number) : Promise<AxiosResponse<dataType>> {
        return instance.put(`to-do-lists/${id}`, newList)
    },

    deleteList(id: number) : Promise<AxiosResponse> {
        return instance.delete(`to-do-lists/${id}`)
    }
}