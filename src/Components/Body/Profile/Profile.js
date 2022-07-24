import React, { Component } from 'react';
import './Stylesheet/Profile.css';
import { connect } from 'react-redux';
import { addUploadFileInfo, getUploadedFile } from '../../../Redux/fileActionCreators';
import axios from "axios";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { authLogout } from '../../../Redux/authActionCreator';
import { Link } from 'react-router-dom';
import Home from '../Home/Home';
import { ethers } from 'ethers';
import abi from '../../../ABI/abi.json';
import { create } from "ipfs-http-client";
import { Buffer } from 'buffer';

const client = create('https://ipfs.infura.io:5001/api/v0');

const mapStateToProps = (state) => {
    return ({
        userId: state.userId,
        user: state.user,
        fileInfo: state.fileInfo,
        fileURL: state.fileURL,
    })
}

const mapDispatchToProps = (dispatch) => {
    return ({
        authLogout: () => dispatch(authLogout()),
        getUploadedFile: () => dispatch(getUploadedFile()),
        addUploadFileInfo: (user, file, fileurl) => dispatch(addUploadFileInfo(user, file, fileurl))
    })
}

class Profile extends Component {
    componentDidMount() {
        this.props.getUploadedFile();
    }

    constructor() {
        super();
        this.state = {
            selectedFile: '',
            applyForAdmin: false,
            file: '',
        }

        // this.handleInputChange = this.handleInputChange.bind(this);
    }

    handOnClick(event) {
        if (event === 'logout') {
            this.props.authLogout();
            window.location.replace('/login');
        }

        if (event === 'applyForAdmin') {
            this.setState({
                applyForAdmin: !this.state.applyForAdmin,
            })
            // window.location.replace('/home');
        }
    }

    // handleInputChange(e) {
    //     this.setState({
    //         selectedFile: e.target.files[0],
    //     })
    // }

    sendToDatabase(url) {
        this.props.user.map((item) => {
            if (item.id === parseInt(this.props.userId)) {
                this.props.addUploadFileInfo(item, this.state.selectedFile, url);
            }
        })

        // setTimeout(() => {
        //     window.location.reload();
        // }, 10000);
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
                        <td>
                            <a href={item.URL} target="_blank">Open File</a>
                        </td>
                        <td>{item.Size}</td>
                        <td>{item.Type}</td>
                        <td>{item.Verified}</td>
                    </tr >
                )
            }
        })

        const retrieveFile = (e) => {
            this.setState({
                selectedFile: e.target.files[0],
            })
            const data = e.target.files[0];
            const reader = new window.FileReader();
            reader.readAsArrayBuffer(data);
            reader.onloadend = () => {
                this.setState({
                    file: Buffer(reader.result),
                })
            }
            e.preventDefault();
        }

        const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                const created = await client.add(this.state.file);
                // console.log("ipfshash ", created);
                const url = `https://ipfs.infura.io/ipfs/${created.path}`;
                this.sendToDatabase(url);
            } catch (error) {
                console.log(error.message);
            }
        };

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
                                            <img src="https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png"
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
                                                            <input type="file" className="form-control" name="upload_file" onChange={retrieveFile} />
                                                        </div>
                                                        <div className="col-4">
                                                            <button type="submit" className="btn btn-dark" onClick={handleSubmit}>Upload</button>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <Button className='mt-4 ' variant="primary" onClick={() => this.handOnClick('applyForAdmin')}>
                                                            Click here for admin verification
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {this.state.applyForAdmin ? <Home id={this.props.userId} user={this.props.user} /> : null}
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>File Id</th>
                                            <th>File Name</th>
                                            <th>File URL</th>
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