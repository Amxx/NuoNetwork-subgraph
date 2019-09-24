import {
	Bytes,
	BigInt,
	BigDecimal,
	EthereumEvent,
} from '@graphprotocol/graph-ts'

import {
	Transaction,
} from '../generated/schema'

export function logTransaction(event: EthereumEvent): Transaction
{
	let tx = new Transaction(event.transaction.hash.toHex());
	tx.from        = event.transaction.from as Bytes;
	tx.to          = event.transaction.to as Bytes;
	tx.value       = event.transaction.value;
	tx.gasUsed     = event.transaction.gasUsed;
	tx.gasPrice    = event.transaction.gasPrice;
	tx.timestamp   = event.block.timestamp;
	tx.blockNumber = event.block.number;
	tx.save();
	return tx as Transaction;
}

export function createEventID(event: EthereumEvent): string
{
	return event.block.number.toString().concat('-').concat(event.logIndex.toString())
}
export function createAccountUserID(accountID: string, userID: string): string
{
	return accountID.concat('-').concat(userID)
}
