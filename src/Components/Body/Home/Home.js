import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../../../ABI/abi.json";
import ErrorMessage from "./Error/ErrorMessages";
import TxList from "./TxList/TxList";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
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
    // console.log(props);
    const [txs, setTxs] = useState([]);
    const [contractListened, setContractListened] = useState();
    const [error, setError] = useState();
    const [contractInfo, setContractInfo] = useState({
        address: "-",
        tokenName: "-",
        tokenSymbol: "-",
        totalSupply: "-"
    });
    const [balanceInfo, setBalanceInfo] = useState({
        address: "-",
        balance: "-"
    });
    const [alertMsg, setalertMsg] = useState({
        positiveMsg: "",
        negativeMsg: "",
    });
    const [showBalance, setshowBalance] = useState(false);

    useEffect(() => {
        addToContract();
        // getMyBalance();

        if (contractInfo.address !== "-") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const erc20 = new ethers.Contract(
                contractInfo.address,
                erc20abi,
                provider
            );

            erc20.on("Transfer", (from, to, amount, event) => {
                console.log({ from, to, amount, event });

                setTxs((currentTxs) => [
                    ...currentTxs,
                    {
                        txHash: event.transactionHash,
                        from,
                        to,
                        amount: String(amount)
                    }
                ]);
            });
            setContractListened(erc20);

            return () => {
                contractListened.removeAllListeners();
            };
        }
    }, [contractInfo.address]);

    const addToContract = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // const contractAddress = "0x9B02382726bDB913DAce319395cDDD7028a897FA";
        const erc20 = new ethers.Contract(contractAddress, abi, provider);

        const tokenName = await erc20.name();
        const tokenSymbol = await erc20.symbol();
        const totalSupply = await erc20.totalSupply();

        setContractInfo({
            address: contractAddress,
            tokenName,
            tokenSymbol,
            totalSupply
        });
    };

    const getMyBalance = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const erc20 = new ethers.Contract(contractInfo.address, erc20abi, provider);
        console.log(erc20);
        const signer = await provider.getSigner();
        const signerAddress = await signer.getAddress();
        const balance = await erc20.balanceOf(signerAddress);

        setBalanceInfo({
            address: signerAddress,
            balance: String(balance)
        });
    };

    const applyForAdmin = () => {
        if (balanceInfo.balance >= 100) {
            setalertMsg({
                positiveMsg: "User can be given the role of an Admin",
                negativeMsg: "",
            });

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
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
                props.updateRole(props.id, currentUser, "admin");
            }

        } else {
            setalertMsg({
                positiveMsg: "",
                negativeMsg: "User can't be an admin because of low balance"
            });
        }
    }

    const handleTransfer = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const erc20 = new ethers.Contract(contractAddress, abi, signer);
        await erc20.transfer(data.get("recipient"), data.get("amount"));
    };

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

    const showMyBalance = () => {
        setshowBalance(!showBalance);
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
                {/* <div className="col-6 pb-4" style={{width:"26vw"}}>
                    <Form onSubmit={handleSubmit}>
                        <div className="credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white" style={{
                            height: "50vh",
                        }}>
                            <main className="mt-4 p-4">
                                <h1 className="text-xl font-semibold text-gray-700 text-center">
                                    Read from smart contract
                                </h1>
                                <div className="my-3">
                                    <div className="row">
                                        <div className="col-7">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="addr"
                                                placeholder="ERC20 contract address" />
                                        </div>
                                        <div className="col-5">
                                            <button
                                                type="submit"
                                                className="btn btn-primary submit-button"
                                            >
                                                Get token info
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </main>
                            <div className="px-4 mt-3">
                                <div className="overflow-x-auto">
                                    <table className="table w-full">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Symbol</th>
                                                <th>Total supply</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th>{contractInfo.tokenName}</th>
                                                <td>{contractInfo.tokenSymbol}</td>
                                                <td>{String(contractInfo.totalSupply)}</td>
                                                <td>{contractInfo.deployedAt}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div> */}

                <div className="col-6 pb-4" style={{
                    width: "40vw"
                }}>
                    {/* <div className="row px-3">
                        <button
                            type="submit"
                            className="btn btn-primary submit-button"
                            onClick={() => handleSubmit()}
                        >
                            Connect to wallet
                        </button>
                    </div> */}

                    <div className="credit-card mt-3 w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white" style={{ height: "31vh" }}>
                        <div className="p-3 row px-4">
                            <button
                                onClick={getMyBalance}
                                type="submit"
                                className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                            >
                                Connect To Wallet
                            </button>
                        </div>
                        <div className="p-3 row px-4">
                            <button
                                onClick={showMyBalance}
                                type="submit"
                                className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                            >
                                Show my balance
                            </button>
                        </div>
                        {showBalance ?
                            <div className="px-4">
                                <div className="overflow-x-auto">
                                    <table className="table w-full">
                                        <thead>
                                            <tr>
                                                <th>Address</th>
                                                <th>Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th>{balanceInfo.address}</th>
                                                <td>{balanceInfo.balance}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div> : null}
                        <div className="p-3 row px-4">
                            <button
                                type="submit"
                                className="btn btn-primary submit-button"
                                onClick={() => applyForAdmin()}
                            >
                                Apply for Admin
                            </button>
                        </div>
                        <div>
                            {positiveMsg()}
                        </div>
                    </div>
                    {/* <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white" style={{
                        height: "30vh",
                    }}>
                        <div className="mt-4 p-4">
                            <h1 className="text-xl font-semibold text-gray-700 text-center">
                                Write to contract
                            </h1>

                            <Form onSubmit={handleTransfer}>
                                <div className="row">
                                    <div className="my-3">
                                        <input
                                            type="text"
                                            name="recipient"
                                            className="form-control"
                                            placeholder="Recipient address"
                                        />
                                    </div>
                                    <div className="my-1">
                                        <input
                                            type="text"
                                            name="amount"
                                            className="form-control"
                                            placeholder="Amount to transfer"
                                        />
                                    </div>
                                    <footer className="p-4">
                                        <button
                                            type="submit"
                                            className="btn btn-primary submit-button focus:ring focus:outline-none w-full mt-4"
                                        >
                                            Transfer
                                        </button>
                                    </footer>
                                </div>

                            </Form>
                        </div>
                    </div> */}

                </div>

            </div>
            {/* <div>
                <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
                    <div className="mt-4 p-4">
                        <h1 className="text-xl font-semibold text-gray-700 text-center">
                            Recent transactions
                        </h1>
                        <p>
                            <TxList txs={txs} />
                        </p>
                    </div>
                </div>
            </div> */}
        </div>
    );
}

export default connect(null, mapDispatchToProps)(Home);
