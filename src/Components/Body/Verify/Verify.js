import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { getUploadedFile } from '../../../Redux/userActionCreators';
import { connect } from 'react-redux';

const mapStateToProps = (state) => {
  return {
    fileInfo: state.fileInfo,
  }
}

const mapDispatchToProps = (dispatch) => {
  return ({
    getUploadedFile: () => dispatch(getUploadedFile()),
  })
}

class Verify extends Component {
  componentDidMount() {
    this.props.getUploadedFile();
  }
  render() {
    const fileInfo = this.props.fileInfo;

    const verifiedfileData = fileInfo.map((item) => {
      if (item.Verified) {
        return (
          < tr >
            <td>{item.id}</td>
            <td>{item.Name}</td>
            <td>{item.Size}</td>
            <td>{item.Type}</td>
            <td>{item.User_Id}</td>
            <td>{item.User_Name}</td>
            <td>{item.User_Email}</td>
            <td>
              <Button className='me-3' variant='success'>Approve</Button>
              <Button variant='danger'>Decline</Button>
            </td>
          </tr >
        )
      }
    })

    const unverifiedfileData = fileInfo.map((item) => {
      if (item.Verified == false) {
        return (
          < tr >
            <td>{item.id}</td>
            <td>{item.Name}</td>
            <td>{item.Size}</td>
            <td>{item.Type}</td>
            <td>{item.User_Id}</td>
            <td>{item.User_Name}</td>
            <td>{item.User_Email}</td>
            <td>
              <Button className='me-3' variant='success'>Approve</Button>
              <Button variant='danger'>Decline</Button>
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
              <th>File Size</th>
              <th>File Type</th>
              <th>User Id</th>
              <th>User Name</th>
              <th>User Email</th>
              <th>Approve / Decline</th>
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
        <h1>Non Verified</h1>
        {nonVerified()}
        <h1 className='mt-5'>Verified</h1>
        {verified()}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Verify)