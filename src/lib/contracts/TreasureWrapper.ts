import Web3 from 'web3';
import * as TreasureJSON from '../../../build/contracts/Treasure.json';
import { Treasure } from '../../types/Treasure';
let args = ['Gold', 'Diamond', 'Ruby'];

const DEFAULT_SEND_OPTIONS = {
    gas: 9000000
};

export class TreasureWrapper {
    web3: Web3;

    contract: Treasure;

    address: string;

    constructor(web3: Web3) {
        this.web3 = web3;
        this.contract = new web3.eth.Contract(TreasureJSON.abi as any) as any;
    }

    get isDeployed() {
        return Boolean(this.address);
    }

    async getTotalTreasuresFor(treasures: string, fromAddress: string) {
        const data = await this.contract.methods.totalTreasuresFor(this.web3.utils.asciiToHex(treasures)).call({ from: fromAddress });

        return parseInt(data, 10);
    }

    async claimForTreasure(treasure: string, fromAddress: string) {
        const tx = await this.contract.methods.claimForTreasure(this.web3.utils.asciiToHex(treasure)).send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress
        });

        return tx;
    }

    async deploy(fromAddress: string) {
        const deployTx = await (this.contract
            .deploy({
                data: TreasureJSON.bytecode,
                arguments: [args.map((arg) => this.web3.utils.asciiToHex(arg))]
            })
            .send({
                ...DEFAULT_SEND_OPTIONS,
                from: fromAddress,
                to: '0x0000000000000000000000000000000000000000'
            } as any) as any);

        this.useDeployed(deployTx.contractAddress);

        return deployTx.transactionHash;
    }

    useDeployed(contractAddress: string) {
        this.address = contractAddress;
        this.contract.options.address = contractAddress;
    }
}
