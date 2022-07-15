import { useState, useEffect } from "react";
import { ethers } from "ethers";
import erc20abi from "./ERC20ABI/ERC20abi.json";
import ErrorMessage from "./Error/ErrorMessages";
import TxList from "./TxList/TxList";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function Home() {
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

    useEffect(() => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const erc20 = new ethers.Contract(data.get("addr"), erc20abi, provider);

        const tokenName = await erc20.name();
        const tokenSymbol = await erc20.symbol();
        const totalSupply = await erc20.totalSupply();

        setContractInfo({
            address: data.get("addr"),
            tokenName,
            tokenSymbol,
            totalSupply
        });
    };

    const getMyBalance = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const erc20 = new ethers.Contract(contractInfo.address, erc20abi, provider);
        const signer = await provider.getSigner();
        const signerAddress = await signer.getAddress();
        const balance = await erc20.balanceOf(signerAddress);

        setBalanceInfo({
            address: signerAddress,
            balance: String(balance)
        });
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const erc20 = new ethers.Contract(contractInfo.address, erc20abi, signer);
        await erc20.transfer(data.get("recipient"), data.get("amount"));
    };

    return (
        <div className="col-5" style={{
            marginLeft: "30vw",
            width: "45vw",
        }}>
            <div className="row">
                <div className="col-6 border">
                    <Form onSubmit={handleSubmit}>
                        <div className="credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
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
                            <div className="p-4">
                                <button
                                    onClick={getMyBalance}
                                    type="submit"
                                    className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                                >
                                    Get my balance
                                </button>
                            </div>
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
                            </div>
                        </div>
                    </Form>
                </div>
                
                <div className="col-6 border" style={{
                    width: "20vw"
                }}>
                    <div className="m-4 credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
                        <div className="mt-4 p-4">
                            <h1 className="text-xl font-semibold text-gray-700 text-center">
                                Write to contract
                            </h1>

                            <Form onSubmit={handleTransfer}>
                                <div className="my-3">
                                    <input
                                        type="text"
                                        name="recipient"
                                        className="input input-bordered block w-full focus:ring focus:outline-none"
                                        placeholder="Recipient address"
                                    />
                                </div>
                                <div className="my-3">
                                    <input
                                        type="text"
                                        name="amount"
                                        className="input input-bordered block w-full focus:ring focus:outline-none"
                                        placeholder="Amount to transfer"
                                    />
                                </div>
                                <footer className="p-4">
                                    <button
                                        type="submit"
                                        className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                                    >
                                        Transfer
                                    </button>
                                </footer>
                            </Form>
                        </div>
                    </div>
                </div>
                
            </div>
            <div>
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
            </div>
        </div>
    );
}

export default Home;
