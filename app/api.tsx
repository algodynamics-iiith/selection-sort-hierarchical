import axios from 'axios'

const client = axios.create({
  baseURL: undefined // For testing. Replace with actual endpoint.
})

export default client
