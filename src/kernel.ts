import {
	Address,
} from '@graphprotocol/graph-ts'

import {
	Token,
	BorrowOrder,
	BorrowOrderCreated,
	BorrowOrderRepaid,
	BorrowOrderDefaulted,
} from '../generated/schema'

import {
	LogOrderCreated   as LogOrderCreatedEvent,
	LogOrderRepaid    as LogOrderRepaidEvent,
	LogOrderDefaulted as LogOrderDefaultedEvent,
} from '../generated/Kernel/Kernel'

import {
	logTransaction,
	createEventID,
	fetchToken,
	decimalValue,
} from './utils'

export function handleLogOrderCreated(event: LogOrderCreatedEvent): void
{
	let pToken = fetchToken(event.params.principalToken)
	let cToken = fetchToken(event.params.collateralToken)

	let order = new BorrowOrder(event.params.orderHash.toHex())
	order.status              = 'ACTIVE'
	order.account             = event.params.account.toHex()
	order.byUser              = event.params.byUser.toHex()
	order.principalToken      = pToken.id
	order.principalAmount     = decimalValue(event.params.principalAmount, pToken.decimals)
	order.collateralToken     = cToken.id
	order.collateralAmount    = decimalValue(event.params.collateralAmount, cToken.decimals)
	order.premium             = decimalValue(event.params.premium, 18)
	order.fee                 = decimalValue(event.params.fee, pToken.decimals)
	order.createdTimestamp    = event.block.timestamp
	order.expirationTimestamp = event.params.expirationTimestamp
	order.save()

	let e = new BorrowOrderCreated(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.order       = order.id
	e.save()
}

export function handleLogOrderRepaid(event: LogOrderRepaidEvent): void
{
	let order = BorrowOrder.load(event.params.orderHash.toHex())
	order.status = 'REPAID'
	order.save()

	let pToken = fetchToken(Address.fromString(order.principalToken))

	let e = new BorrowOrderRepaid(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.order       = order.id
	e.valueRepaid = decimalValue(event.params.valueRepaid, pToken.decimals)
	e.save()
}

export function handleLogOrderDefaulted(event: LogOrderDefaultedEvent): void
{
	let order = new BorrowOrder(event.params.orderHash.toHex())
	order.status = 'DEFAULTED'
	order.save()

	let e = new BorrowOrderDefaulted(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.order       = order.id
	e.reason      = event.params.reason
	e.save()
}
