import React, { Component } from 'react';
import './Stylesheet/Profile.css';
import { connect } from 'react-redux';
import { getUser } from '../../../Redux/userActionCreators';
import axios from "axios";

const mapStateToProps = (state) => {
    return ({
        userId: state.userId,
        user: state.user,
    })
}

const mapDispatchToProps = (dispatch) => {
    return ({
        getUser: () => dispatch(getUser()),
    })
}

class Profile extends Component {
    componentDidMount() {
        // this.props.getUser();
    }

    constructor() {
        super();
        this.state = {
            selectedFile: '',
        }

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        // console.log(event.target.files[0]);
        this.setState({
            selectedFile: event.target.files[0],
        })
    }

    submit() {
        const data = new FormData();
        data.append('file', this.state.selectedFile);

        let url = "/api";

        axios.post(url, data)
            .then(res => { // then print response status
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
                                                alt="Avatar" className="img-fluid my-5" style={{ width: "80px" }} />
                                            <h5>{currentUser.Name}</h5>
                                            <p>{currentUser.Role[0]}, {currentUser.Role[1]}, {currentUser.Role[2]}</p>
                                            <i className="far fa-edit mb-5"></i>
                                        </div>
                                        <div className="col-md-8 p-3">
                                            <h5 className='mt-4'>Information</h5>
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
                                                    {/* <form action="/api" method="POST" encType='multipart/form-data'>
                                                        <input type="file" className="custom-file-input" name="upload" multiple id="validatedCustomFile" required />
                                                        <input type="submit" value="Upload" />
                                                        <label className="custom-file-label" for="validatedCustomFile">Choose file</label>
                                                    </form> */}
                                                    <div className="form-row">
                                                        <input type="file" className="form-control" name="upload_file" onChange={this.handleInputChange} />
                                                        <button type="submit" className="btn btn-dark" onClick={() => this.submit()}>Save</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                </section >
            </div >
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)