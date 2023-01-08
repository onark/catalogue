import axios from 'axios'
const baseUrl = '/api/cats'

const getAll = () => {
    return axios.get(baseUrl)
}

const create = newObject => {
    return axios.post(baseUrl, newObject)
}

const deleteCat = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
}

const api = { getAll, create, deleteCat, update };
export default { ...api };
