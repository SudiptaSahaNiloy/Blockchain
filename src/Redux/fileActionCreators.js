import axios from "axios";
import * as actionTypes from './actionTypes';
import { contractAddress } from "../Contract/contractAddress";
import abi from '../ABI/abi.json';
import { ethers } from "ethers";

const URL = 'http://localhost:3001/UploadedFile/';

export const updateFileVerification = (verification, file) => {
    const file_id = file.id;

    let Verified = false;
    // console.log(Verified);

    if (verification === 'approve') {
        Verified = 'Approved';
    } else {
        Verified = "Denied";
    }

    axios.put(URL + file_id, {
        ...file,
        Verified: Verified,
    })
        .then(resp => {
            console.log(resp.data);
        }).catch(error => {
            console.log(error);
        });
}

export const fileUploaded = (fileInfo) => {
    return {
        type: actionTypes.UPLOADED_FILE_INFO,
        payload: {
            fileInfo: fileInfo
        }
    }
}

export const getUploadedFile = () => dispatch => {
    axios.get(URL)
        .then(res => dispatch(fileUploaded(res.data)))
        .catch(err => console.log(err))
}

export const uploadFileInfoToContract = async (res) => {
    console.log(res);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner(); //connect to metamask
    const contract = new ethers.Contract(contractAddress, abi, signer);

    await contract.documentRegistration(res.id, "des", "url");
}

export const addUploadFileInfo = (user, file) => dispatch => {
    const uploadedFileData = {
        User_Id: user.id,
        User_Name: user.Name,
        User_Email: user.Email,
        User_Institution: user.Institution,
        Name: file.name,
        Size: file.size,
        Type: file.type,
        Verified: "Pending...",
    }

    axios.post(URL, uploadedFileData)
        .then((res) => dispatch(uploadFileInfoToContract(res.data)))
        .catch((err) => console.log(err))
}
