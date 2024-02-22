import axios from 'axios'

const client = axios.create({
  // baseURL: "https://m31ukjsiqd.execute-api.ap-south-2.amazonaws.com/Prod"
  baseURL: undefined // For testing. Replace with actual endpoint.
})

export default client
