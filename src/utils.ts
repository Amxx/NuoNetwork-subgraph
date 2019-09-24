import {
	BigInt,
	BigDecimal,
	EthereumEvent,
} from '@graphprotocol/graph-ts'

export function createEventID(event: EthereumEvent): string
{
	return event.block.number.toString().concat('-').concat(event.logIndex.toString())
}
export function createAccountUserID(accountID: string, userID: string): string
{
	return accountID.concat('-').concat(userID)
}
