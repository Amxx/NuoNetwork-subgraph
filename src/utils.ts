import {
	Address,
	Bytes,
	EthereumEvent,
} from '@graphprotocol/graph-ts'

import {
	ERC20 as ERC20Contract,
} from '../generated/templates/Account/ERC20'

import {
	Token,
	Transaction,
} from '../generated/schema'

export function logTransaction(event: EthereumEvent): Transaction
{
	let tx = new Transaction(event.transaction.hash.toHex())
	tx.from        = event.transaction.from as Bytes
	tx.to          = event.transaction.to as Bytes
	tx.value       = event.transaction.value
	tx.gasUsed     = event.transaction.gasUsed
	tx.gasPrice    = event.transaction.gasPrice
	tx.timestamp   = event.block.timestamp
	tx.blockNumber = event.block.number
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

export function createToken(address: Address): Token
{
	let erc20 = ERC20Contract.bind(address)
	let token = new Token(address.toHex())
	let name       = erc20.try_name()
	let symbol     = erc20.try_symbol()
	let decimals   = erc20.try_decimals()
	token.name     = name.reverted     ? address.toHex() : name.value
	token.symbol   = symbol.reverted   ? address.toHex() : symbol.value
	token.decimals = decimals.reverted ? 0               : decimals.value
	token.save()
	return token;
}
