import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../../../ABI/abi.json";
import { connect } from 'react-redux';
import { updateRole } from "../../../Redux/userActionCreators";
import Alert from 'react-bootstrap/Alert';
import { contractAddress } from "../../../Contract/contractAddress";

const mapDispatchToProps = (dispatch) => {
    return ({
        updateRole: (id, user, role) => dispatch(updateRole(id, user, role)),
    })
}

function Home(props) {
    const [accountInfo, setAccountInfo] = useState({
        address: ""
    });
    const [alertMsg, setalertMsg] = useState({
        positiveMsg: "",
        negativeMsg: "",
    });

    const connectToWallet = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner(); //connect to metamask
        const signerAddress = await signer.getAddress();

        setAccountInfo({
            address: signerAddress
        });
    };

    const applyForAdmin = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner(); //connect to metamask
        const contract = new ethers.Contract(contractAddress, abi, signer);

        let currentUser = null;

        props.user.map((item) => {
            if (item.id === parseInt(props.id)) {
                currentUser = Object.assign({}, item);
            }
        })

        let admin = false;
        if (currentUser.Role[1] === 'admin') {
            setalertMsg({
                positiveMsg: "User is already given the role of an admin",
                negativeMsg: "",
            });
            setTimeout(() => {
                window.location.reload();
            }, 3000);
            admin = true;
        }
        if (admin === false) {
            await contract.applyForAdmin({ value: ethers.utils.parseUnits("100", 0) });
            setalertMsg({
                positiveMsg: "User is given the role of an Admin",
                negativeMsg: "",
            });
            // window.location.reload();
            props.updateRole(props.id, currentUser, "admin");
        }
    }

    const positiveMsg = () => {
        if (alertMsg.positiveMsg !== "") {
            return (
                <Alert variant={'success'}>
                    {alertMsg.positiveMsg}
                </Alert>
            )
        } else if (alertMsg.negativeMsg !== "") {
            return (
                <Alert variant={'danger'}>
                    {alertMsg.negativeMsg}
                </Alert>
            )
        }
        else {
            return null;
        }
    }

    return (
        <div
            className="col mb-5" style={{
                marginLeft: "-14rem",
                width: "70vw",
                // height: "60vh",
            }}>
            <div className="row" style={{
                // height: "58vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <div className="col-6 pb-4" style={{
                    width: "40vw"
                }}>
                    <div className="credit-card mt-3 w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white" style={{ height: "31vh" }}>
                        <div className="p-3 row px-4">
                            <button
                                onClick={connectToWallet}
                                type="submit"
                                className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                            >
                                Connect To Wallet
                            </button>
                            {accountInfo.address !== "" ? <h5 className="mt-3">Wallet Address: {accountInfo.address}</h5> : null}
                        </div>
                        <div className="p-3 row px-4">
                            <button
                                type="submit"
                                className="btn btn-primary submit-button"
                                onClick={() => applyForAdmin()}
                            >
                                Pay 100 Wei to apply for admin
                            </button>
                        </div>
                        <div>
                            {positiveMsg()}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default connect(null, mapDispatchToProps)(Home);
