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
	tokenValue,
} from './utils'

export function handleLogOrderCreated(event: LogOrderCreatedEvent): void
{
	let principal  = Token.load(event.params.principalToken.toHex())
	let collateral = Token.load(event.params.collateralToken.toHex())

	let order = new BorrowOrder(event.params.orderHash.toHex())
	order.status              = 'ACTIVE'
	order.account             = event.params.account.toHex()
	order.byUser              = event.params.byUser.toHex()
	order.principalToken      = principal.id
	order.principalAmount     = tokenValue(event.params.principalAmount, principal.decimals as u8)
	order.collateralToken     = collateral.id
	order.collateralAmount    = tokenValue(event.params.collateralAmount, collateral.decimals as u8)
	order.premium             = tokenValue(event.params.premium, 18)
	order.fee                 = tokenValue(event.params.fee, principal.decimals as u8)
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

	let e = new BorrowOrderRepaid(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.order       = order.id
	e.valueRepaid = tokenValue(event.params.valueRepaid, Token.load(order.principalToken).decimals as u8)
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
