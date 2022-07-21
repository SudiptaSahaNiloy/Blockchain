import { connect } from 'react-redux';
import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import { Button } from 'reactstrap';
import { updateRole } from '../../Redux/userActionCreators';
import Form from 'react-bootstrap/Form';
import { ethers } from "ethers";
import abi from "../../ABI/abi.json";
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';

const mapStateToProps = (state) => {
    return ({
        user: state.user,
        userInstitution: state.userInstitution,
        contractAddress: state.contractAddress,
    })
}

const mapDispatchToProps = (dispatch) => {
    return ({
        updateRole: (id, user, role) => dispatch(updateRole(id, user, role)),
    })
}

class Admin extends Component {
    handleOnClick = async (id, user) => {
        // console.log(this.props.contractAddress);
        let verifier = false;
        if (user.Role[2] === 'verifier') {
            verifier = true;
        }
        if (verifier === false) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner(); //connect to metamask
            const contract = new ethers.Contract(this.props.contractAddress, abi, signer);
            await contract.addVerifiers(user.WalletAddress);

            if (await contract.checkIfVerifiers(user.WalletAddress)) {
                window.location.reload();
                // this.props.updateRole(id, user, "verifier");
            }
        }
    }

    render() {
        let user = null;

        user = this.props.user.map((item) => {
            if (this.props.userInstitution === item.Institution) {
                return (
                    <tbody>
                        <tr>
                            <td>{item.id}</td>
                            <td>{item.Name}</td>
                            <td>{item.Email}</td>
                            <td>{item.Institution}</td>
                            <td>{item.Role[1] === 'admin' ? "YES" : "NO"}</td>
                            <td>{item.Role[2] === 'verifier' ? "YES" : "NO"}</td>
                            <td>{item.WalletAddress}</td>
                            <td>
                                <Button onClick={() => this.handleOnClick(item.id, item)}>
                                    Make Verifier
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                )
            }
        })

        return (
            <div className='p-5'>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Institution</th>
                            <th>Admin</th>
                            <th>Verifier</th>
                            <th>Wallet Address</th>
                            <th>Make Verifier</th>
                        </tr>
                    </thead>
                    {user}
                </ Table>
            </div>

        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
