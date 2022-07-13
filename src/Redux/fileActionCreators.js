import axios from "axios";
import * as actionTypes from './actionTypes';

const URL = 'http://localhost:3001/UploadedFile/';

export const updateFileVerification = (verification, file) => {
    const file_id = file.id;

    let Verified = false;
    console.log(Verified);

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

export const addUploadFileInfo = (user, file) => {
    const uploadedFileData = {
        User_Id: user.id,
        User_Name: user.Name,
        User_Email: user.Email,
        Name: file.name,
        Size: file.size,
        Type: file.type,
        Verified: "Pending...",
    }

    axios.post(URL, uploadedFileData)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err))
}
