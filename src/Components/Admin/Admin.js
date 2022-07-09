import { connect } from 'react-redux';
import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import { Button } from 'reactstrap';
import { updateRole } from '../../Redux/userActionCreators';

const mapStateToProps = (state) => {
    return ({
        user: state.user,
    })
}

const mapDispatchToProps = (dispatch) => {
    return ({
        updateRole: (id, user) => dispatch(updateRole(id, user)),
    })
}

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
        }
    }

    handleOnClick = (id, user) => {
        // console.log(user.Role);
        let verifier = false;
        if (user.Role[2] === 'verifier') {
            verifier = true;
        }
        if (verifier === false) {
            this.props.updateRole(id, user);
            window.location.reload();
        }
    }

    render() {
        let user = null;

        // console.log(this.props.user);

        user = this.props.user.map((item) => {
            return (
                <tbody>
                    <tr>
                        <td>{item.id}</td>
                        <td>{item.Name}</td>
                        <td>{item.Email}</td>
                        <td>{item.Institution}</td>
                        <td>
                            <Button onClick={() => this.handleOnClick(item.id, item)}>
                                Make Verifier
                            </Button>
                        </td>
                    </tr>
                </tbody>
            )
        })

        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#id</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Institution</th>
                        <th>Make Verifier</th>
                    </tr>
                </thead>
                {user}
            </Table>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
