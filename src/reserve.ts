import {
	BigInt,
	log,
} from '@graphprotocol/graph-ts'

import {
	Token,
	LendOrder,
	LendOrderCreated,
	LendOrderCancelled,
	LendOrderCumulativeUpdate,
	TokenReserve,
} from '../generated/schema'

import {
	LogOrderCreated           as LogOrderCreatedEvent,
	LogOrderCancelled         as LogOrderCancelledEvent,
	LogOrderCumulativeUpdated as LogOrderCumulativeUpdatedEvent,
	LogReserveValuesUpdated   as LogReserveValuesUpdatedEvent,
} from '../generated/Reserve/Reserve'

import {
	logTransaction,
	createEventID,
} from './utils'

export function handleLogOrderCreated(event: LogOrderCreatedEvent): void
{
	let order = new LendOrder(event.params.orderHash.toHex())
	order.status              = 'ACTIVE'
	order.account             = event.params.account.toHex()
	order.token               = event.params.token.toHex()
	order.byUser              = event.params.byUser.toHex()
	order.createdValue        = event.params.value
	order.createdTimestamp    = event.block.timestamp
	order.cumulativeValue     = event.params.value
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
	let order = new LendOrder(event.params.orderHash.toHex())
	order.cumulativeValue     = event.params.value
	order.cumulativeTimestamp = event.params.updatedTill
	order.save()

	let e = new LendOrderCumulativeUpdate(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.order       = order.id
	e.value       = event.params.value
	e.save()
}

export function handleLogReserveValuesUpdated(event: LogReserveValuesUpdatedEvent): void
{
	let transaction = logTransaction(event)

	let e = new TokenReserve(createEventID(event))
	e.transaction = transaction.id
	e.timestamp   = event.block.timestamp
	e.token       = event.params.token.toHex()
	e.reserve     = event.params.reserve
	e.profit      = event.params.profit
	e.loss        = event.params.loss
	e.save()
}
