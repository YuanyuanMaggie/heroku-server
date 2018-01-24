import axios from 'axios';
import { FETCH_USER } from './types';

// if redux thunk see we return an function, will add dispatch param automatically
// export const fetchUser = () => {
//     return (dispatch)=>{
//         axios.get('/api/current_user')
//         .then( ({data}) => dispatch({type: FETCH_USER, payload: data}));
//     }
// }

export const fetchUser = () => async dispatch => {
   const { data }  = await axios.get('/api/current_user');
   dispatch({type: FETCH_USER, payload: data});
}

export const handleToken = token => async dispatch => {
    const { data }  = await axios.post('/api/stripe', token);
    dispatch({type: FETCH_USER, payload: data});
}