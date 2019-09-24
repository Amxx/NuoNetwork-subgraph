import {
	KernelOrder,
	KernelOrderCreated,
	KernelOrderRepaid,
	KernelOrderDefaulted,
} from '../generated/schema'

import {
	LogOrderCreated   as LogOrderCreatedEvent,
	LogOrderRepaid    as LogOrderRepaidEvent,
	LogOrderDefaulted as LogOrderDefaultedEvent,
} from '../generated/Kernel/Kernel'

import {
	logTransaction,
	createEventID,
} from './utils'

export function handleLogOrderCreated(event: LogOrderCreatedEvent): void
{
	let order = new KernelOrder(event.params.orderHash.toHex())
	order.status              = 'ACTIVE'
	order.account             = event.params.account.toHex()
	order.byUser              = event.params.byUser.toHex()
	order.principalToken      = event.params.principalToken.toHex()
	order.principalAmount     = event.params.principalAmount
	order.collateralToken     = event.params.collateralToken.toHex()
	order.collateralAmount    = event.params.collateralAmount
	order.premium             = event.params.premium
	order.fee                 = event.params.fee
	order.createdTimestamp    = event.block.timestamp
	order.expirationTimestamp = event.params.expirationTimestamp
	order.save()

	let e = new KernelOrderCreated(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.order       = order.id
	e.save()
}

export function handleLogOrderRepaid(event: LogOrderRepaidEvent): void
{
	let order = new KernelOrder(event.params.orderHash.toHex())
	order.status = 'REPAID'
	order.save()

	let e = new KernelOrderRepaid(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.order       = order.id
	e.valueRepaid = event.params.valueRepaid
	e.save()
}

export function handleLogOrderDefaulted(event: LogOrderDefaultedEvent): void
{
	let order = new KernelOrder(event.params.orderHash.toHex())
	order.status = 'DEFAULTED'
	order.save()

	let e = new KernelOrderDefaulted(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.order       = order.id
	e.reason      = event.params.reason
	e.save()
}
