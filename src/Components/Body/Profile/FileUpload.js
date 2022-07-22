import React, { Component } from 'react';
import { useState } from "react";
import { create } from "ipfs-http-client";
import { Buffer } from 'buffer';
import { connect } from 'react-redux';
import { getUploadFileURL } from '../../../Redux/fileActionCreators';

const client = create('https://ipfs.infura.io:5001/api/v0');

class FileUpload extends Component {
    constructor() {
        super();
        this.state = {
            file: '',
            fileurl: '',
        }
    }

    render() {
        console.log(this.state);

        const retrieveFile = (e) => {
            const data = e.target.files[0];
            const reader = new window.FileReader();
            reader.readAsArrayBuffer(data);
            console.log("readerresult ", reader.result);
            reader.onloadend = () => {
                console.log(Buffer(reader.result));
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
                console.log("ipfshash ", created);
                const url = `https://ipfs.infura.io/ipfs/${created.path}`;
                this.setState({
                    fileurl: url,
                })
            } catch (error) {
                console.log(error.message);
            }
        };

        console.log(this.state.fileurl);


        return (
            <div>
                <form className="form" onSubmit={handleSubmit}>
                    <input type="file" name="data" onChange={retrieveFile} />
                    <button type="submit" className="btn btn-dark">Upload file</button>
                </form>

                <div className="display">
                    {this.state.fileurl.length !== 0
                        ? <img src={this.state.fileurl} alt="nfts" />
                        : <h3>Upload data</h3>}
                </div>
            </div>
        );
    }
}

export default FileUpload