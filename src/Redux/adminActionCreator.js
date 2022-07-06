import axios from "axios";
import * as actionTypes from "./actionTypes.js";

export const customerList = (customers) => {
    return {
        type: actionTypes.CUSTOMER_LIST,
        payload: customers,
    }
}

export const getCustomers = () => dispatch => {
    const URL = 'http://localhost:3001/Customer';
    axios.get(URL)
        .then(response => dispatch(customerList(response.data)))
}

export const deleteCustomers = (id) => dispatch => {
    // console.log("good");
    const URL = 'http://localhost:3001/Customer/';
    axios.delete(URL + id)
        .then(response => response.data)
}

// export const carList = (cars) => {
//     return{
//         type: actionTypes.CAR_LIST,
//         payload: cars,
//     }
// }

// export const getCars = () => dispatch => {
//     const URL = 'http://localhost:3001/CarCollection';
//     axios.get(URL)
//         .then(response => dispatch(carList(response.data)))
// }

export const deleteCar = (id) => dispatch => {
    // console.log("good");
    const URL = 'http://localhost:3001/CarCollection/';
    axios.delete(URL + id)
        .then(response => response.data)
}

export const invoiceList = (invoice) => {
    return {
        type: actionTypes.INVOICE_LIST,
        payload: invoice,
    }
}

export const deleteInvoice = (id) => dispatch => {
    // console.log("good");
    const URL = 'http://localhost:3001/Invoice/';
    axios.delete(URL + id)
        .then(response => response.data)
}

export const getInvoice = () => dispatch => {
    const URL = 'http://localhost:3001/Invoice';
    axios.get(URL)
        .then(response => dispatch(invoiceList(response.data)))
}


