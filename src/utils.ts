import {
	Address,
	Bytes,
	BigInt,
	BigDecimal,
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
	// tx.from        = event.transaction.from as Bytes
	// tx.to          = event.transaction.to as Bytes
	// tx.value       = event.transaction.value
	// tx.gasUsed     = event.transaction.gasUsed
	// tx.gasPrice    = event.transaction.gasPrice
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

export function fetchToken(address: Address): Token
{
	let token = Token.load(address.toHex())
	if (token == null)
	{
		token = new Token(address.toHex())
		let erc20 = ERC20Contract.bind(address)
		token.decimals = erc20.decimals().toI32()
		token.save()
	}
	return token as Token;
}

export function decimalValue(value: BigInt, decimals: i32): BigDecimal
{
	return value.toBigDecimal().div(BigInt.fromI32(10).pow(decimals as u8).toBigDecimal())
}
