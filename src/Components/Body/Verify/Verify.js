import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { getUploadedFile, updateFileVerification } from '../../../Redux/fileActionCreators';
import { connect } from 'react-redux';
import { ethers } from "ethers";
import abi from "../../../ABI/abi.json";
import { contractAddress } from '../../../Contract/contractAddress';

const mapStateToProps = (state) => {
  return {
    user: state.user,
    userInstitution: state.userInstitution,
    fileInfo: state.fileInfo,
    // contractAddress: state.contractAddress,
  }
}

const mapDispatchToProps = (dispatch) => {
  return ({
    getUploadedFile: () => dispatch(getUploadedFile()),
    updateFileVerification: (verification, file) => dispatch(updateFileVerification(verification, file))
  })
}

class Verify extends Component {
  componentDidMount() {
    this.props.getUploadedFile();
  }

  handleOnClick = async (verification, file) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner(); //connect to metamask
    const contract = new ethers.Contract(contractAddress, abi, signer);

    if (verification === 'approve') {
      await contract.vote(file.id, 1);
    } else {
      await contract.vote(file.id, 2);
    }

    let approved = '';

    setTimeout(async () => {
      if (await contract.checkApplicationStatus(file.id)){
        console.log("yes");
        this.props.updateFileVerification('approve', file);
      }  
      else {
        console.log("no");
        this.props.updateFileVerification('decline', file);
      }
    }, 10000);

    // console.log(approved);

    // window.location.reload();
  }

  render() {
    const fileInfo = [];
    this.props.fileInfo.map((item) => {
      if (item.User_Institution === this.props.userInstitution) {
        fileInfo.push(item);
      }
    })

    const verifiedfileData = fileInfo.map((item) => {
      if (item.Verified !== "Pending...") {
        return (
          < tr >
            <td>{item.id}</td>
            <td>{item.Name}</td>
            <td>
              <a href={item.URL} target="_blank">Open File</a>
            </td>
            <td>{item.Size}</td>
            <td>{item.Type}</td>
            <td>{item.User_Id}</td>
            <td>{item.User_Name}</td>
            <td>{item.User_Email}</td>
          </tr >
        )
      }
    })

    const unverifiedfileData = fileInfo.map((item) => {
      if (item.Verified === "Pending...") {
        return (
          < tr >
            <td>{item.id}</td>
            <td>{item.Name}</td>
            <td>
              <a href={item.URL} target="_blank">Open File</a>
            </td>
            <td>{item.Size}</td>
            <td>{item.Type}</td>
            <td>{item.User_Id}</td>
            <td>{item.User_Name}</td>
            <td>{item.User_Email}</td>
            <td>
              <Button className='me-3' variant='success' onClick={() => this.handleOnClick('approve', item)}>Approve</Button>
              <Button variant='danger' onClick={() => this.handleOnClick('decline', item)}>Decline</Button>
            </td>
          </tr >
        )
      }
    })

    const nonVerified = () => {
      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>File Id</th>
              <th>File Name</th>
              <th>File URL</th>
              <th>File Size</th>
              <th>File Type</th>
              <th>User Id</th>
              <th>User Name</th>
              <th>User Email</th>
              <th>Approve / Decline</th>
            </tr>
          </thead>
          <tbody>
            {unverifiedfileData}
          </tbody>
        </Table>
      )
    }

    const verified = () => {
      return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>File Id</th>
              <th>File Name</th>
              <th>File URL</th>
              <th>File Size</th>
              <th>File Type</th>
              <th>User Id</th>
              <th>User Name</th>
              <th>User Email</th>
            </tr>
          </thead>
          <tbody>
            {verifiedfileData}
          </tbody>
        </Table>
      )
    }

    return (
      <div className='p-5'>
        <h1>Pending...</h1>
        {nonVerified()}
        <h1 className='mt-5'>Done Voting</h1>
        {verified()}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Verify)