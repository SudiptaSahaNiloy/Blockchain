import React, { Component } from 'react';
import './Stylesheet/Profile.css';
import { connect } from 'react-redux';
import { addUploadFileInfo, getUploadedFile } from '../../../Redux/fileActionCreators';
import axios from "axios";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { authLogout } from '../../../Redux/authActionCreator';
import { Link } from 'react-router-dom';

const mapStateToProps = (state) => {
    return ({
        userId: state.userId,
        user: state.user,
        fileInfo: state.fileInfo,
    })
}

const mapDispatchToProps = (dispatch) => {
    return ({
        authLogout: () => dispatch(authLogout()),
        getUploadedFile: () => dispatch(getUploadedFile()),
        addUploadFileInfo: (user, file) => dispatch(addUploadFileInfo(user, file))
    })
}

class Profile extends Component {
    componentDidMount() {
        this.props.getUploadedFile();
    }

    handOnClick(event) {
        if (event === 'logout') {
            this.props.authLogout();
            window.location.replace('/login');
        }
    }

    constructor() {
        super();
        this.state = {
            selectedFile: '',
        }

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.setState({
            selectedFile: event.target.files[0],
        })
    }

    submit() {
        window.location.reload();
        this.props.user.map((item) => {
            if (item.id === parseInt(this.props.userId)) {
                this.props.addUploadFileInfo(item, this.state.selectedFile);
            }
        })

        const data = new FormData();
        data.append('file', this.state.selectedFile);

        let url = "/api";

        axios.post(url, data)
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err))
    }

    render() {
        const userId = parseInt(localStorage.getItem('userId'));

        let currentUser = {
            Name: "",
            Email: "",
            Institution: "",
            Role: []
        };

        this.props.user.map((item) => {
            if (item.id === userId) {
                currentUser.Name = item.Name;
                currentUser.Email = item.Email;
                currentUser.Institution = item.Institution;
                currentUser.Role = item.Role;
            }
        })

        const uploadedFiles = this.props.fileInfo.map((item) => {
            if (item.User_Id === userId) {
                return (
                    <tr>
                        <td>{item.id}</td>
                        <td>{item.Name}</td>
                        <td>{item.Size}</td>
                        <td>{item.Type}</td>
                        <td>{item.Verified}</td>
                    </tr >
                )
            }
        })

        return (
            <div>
                <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
                    <div className="container py-5 h-100">
                        <div className="row d-flex justify-content-center mt-5 h-100">
                            <div className="col col-lg-8 mb-4 mb-lg-0">
                                <div className="card mb-3" style={{ borderRadius: '.5rem' }}>
                                    <div className="row g-0">
                                        <div className="col-md-4 gradient-custom text-center text-white"
                                            style={{ borderTopLeftRadius: ".5rem", borderBottomLeftRadius: ".5rem" }}>
                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                                alt="Avatar" className="img-fluid my-3" style={{ width: "80px" }} />
                                            <h5>{currentUser.Name}</h5>
                                            <p>{currentUser.Role[0]}, {currentUser.Role[1]}, {currentUser.Role[2]}</p>
                                            <Button className='mb-3' variant="outline-danger" onClick={() => this.handOnClick('logout')}>Logout</Button>
                                            <i className="far fa-edit mb-5"></i>
                                        </div>
                                        <div className="col-md-8 p-3">
                                            <h5>Information</h5>
                                            <hr className="mt-0 mb-4" />
                                            <div className="row pt-1">
                                                <div className="col-6 mb-3">
                                                    <h6>Email</h6>
                                                    <p className="text-muted">{currentUser.Email}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6>Institution</h6>
                                                    <p className="text-muted">{currentUser.Institution}</p>
                                                </div>
                                            </div>
                                            <div className="row pt-1">
                                                <div className="custom-file">
                                                    <div className="row">
                                                        <div className="col-8">
                                                            <input type="file" className="form-control" name="upload_file" onChange={this.handleInputChange} />
                                                        </div>
                                                        <div className="col-4">
                                                            <button type="submit" className="btn btn-dark" onClick={() => this.submit()}>Upload</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>File Id</th>
                                            <th>File Name</th>
                                            <th>File Size</th>
                                            <th>File Type</th>
                                            <th>File Verification</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {uploadedFiles}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div >
                </section >
            </div >
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)