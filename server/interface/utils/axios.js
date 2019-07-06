import axios from 'axios'

const instance = axios.create({
	baseURL:`http://${process.env.Host||'localhost'}:${process.env.PORT||1000}`,	
	// baseURL:"http://localhost:5000",
	timeout:1000, // 超时
	headers:{
		
	}
})

export default instance