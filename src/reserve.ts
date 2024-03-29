import {
	Address,
} from '@graphprotocol/graph-ts'

import {
	Token,
	LendOrder,
	LendOrderCreated,
	LendOrderCancelled,
	LendOrderCumulativeUpdate,
	TokenReserveUpdate,
	TokenReserveRelease,
	TokenReserveLoss,
} from '../generated/schema'

import {
	LogOrderCreated           as LogOrderCreatedEvent,
	LogOrderCancelled         as LogOrderCancelledEvent,
	LogOrderCumulativeUpdated as LogOrderCumulativeUpdatedEvent,
	LogReserveValuesUpdated   as LogReserveValuesUpdatedEvent,
	LogRelease                as LogReleaseEvent,
	LogLock                   as LogLockEvent,
} from '../generated/Reserve/Reserve'

import {
	logTransaction,
	createEventID,
	fetchToken,
	decimalValue,
} from './utils'

export function handleLogOrderCreated(event: LogOrderCreatedEvent): void
{
	let token = fetchToken(event.params.token)

	let order = new LendOrder(event.params.orderHash.toHex())
	order.status              = 'ACTIVE'
	order.account             = event.params.account.toHex()
	order.token               = token.id
	order.byUser              = event.params.byUser.toHex()
	order.createdValue        = decimalValue(event.params.value, token.decimals)
	order.createdTimestamp    = event.block.timestamp
	order.cumulativeValue     = decimalValue(event.params.value, token.decimals)
	order.cumulativeTimestamp = event.block.timestamp
	order.expirationTimestamp = event.params.expirationTimestamp
	order.save()

	let e = new LendOrderCreated(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.order       = order.id
	e.save()
}

export function handleLogOrderCancelled(event: LogOrderCancelledEvent): void
{
	let order = new LendOrder(event.params.orderHash.toHex())
	order.status = 'CLOSED'
	order.save()

	let e = new LendOrderCancelled(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.order       = order.id
	e.by          = event.params.by
	e.save()
}

export function handleLogOrderCumulativeUpdated(event: LogOrderCumulativeUpdatedEvent): void
{
	let order = LendOrder.load(event.params.orderHash.toHex())
	let token = fetchToken(Address.fromString(order.token))
	order.cumulativeValue     = decimalValue(event.params.value, token.decimals)
	order.cumulativeTimestamp = event.params.updatedTill
	order.save()

	let e = new LendOrderCumulativeUpdate(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.order       = order.id
	e.value       = decimalValue(event.params.value, token.decimals)
	e.save()
}

export function handleLogReserveValuesUpdated(event: LogReserveValuesUpdatedEvent): void
{
	let token = fetchToken(event.params.token)

	let e = new TokenReserveUpdate(token.symbol.concat('-').concat(createEventID(event)))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.token       = token.id
	e.reserve     = decimalValue(event.params.reserve, token.decimals)
	e.profit      = decimalValue(event.params.profit, token.decimals)
	e.loss        = decimalValue(event.params.loss, token.decimals)
	e.updatedTill = event.params.updatedTill
	e.save()
}

export function handleLogRelease(event: LogReleaseEvent): void
{
	let token = fetchToken(event.params.token)

	let e = new TokenReserveRelease(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.token       = token.id
	e.to          = event.params.to.toHex()
	e.value       = decimalValue(event.params.value, token.decimals)
	e.by          = event.params.by
	e.save()
}

export function handleLogLock(event: LogLockEvent): void
{
	let token = fetchToken(event.params.token)

	let e = new TokenReserveLoss(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.token       = token.id
	e.from        = event.params.from.toHex()
	e.value       = decimalValue(event.params.value, token.decimals)
	e.profit      = decimalValue(event.params.profit, token.decimals)
	e.loss        = decimalValue(event.params.loss, token.decimals)
	e.by          = event.params.by
	e.save()
}
