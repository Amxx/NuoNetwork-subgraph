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
	tokenValue,
} from './utils'

export function handleLogOrderCreated(event: LogOrderCreatedEvent): void
{
	let token = Token.load(event.params.token.toHex())

	let order = new LendOrder(event.params.orderHash.toHex())
	order.status              = 'ACTIVE'
	order.account             = event.params.account.toHex()
	order.token               = token.id
	order.byUser              = event.params.byUser.toHex()
	order.createdValue        = tokenValue(event.params.value, token.decimals as u8)
	order.createdTimestamp    = event.block.timestamp
	order.cumulativeValue     = tokenValue(event.params.value, token.decimals as u8)
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
	let token = Token.load(order.token)
	order.cumulativeValue     = tokenValue(event.params.value, token.decimals as u8)
	order.cumulativeTimestamp = event.params.updatedTill
	order.save()

	let e = new LendOrderCumulativeUpdate(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.order       = order.id
	e.value       = tokenValue(event.params.value, token.decimals as u8)
	e.save()
}

export function handleLogReserveValuesUpdated(event: LogReserveValuesUpdatedEvent): void
{
	let token       = Token.load(event.params.token.toHex())
	let transaction = logTransaction(event)

	let el = new TokenReserve(token.symbol.toString().concat('-latest'))
	el.transaction = transaction.id
	el.timestamp   = event.block.timestamp
	el.token       = event.params.token.toHex()
	el.reserve     = tokenValue(event.params.reserve, token.decimals as u8)
	el.profit      = tokenValue(event.params.profit, token.decimals as u8)
	el.loss        = tokenValue(event.params.loss, token.decimals as u8)
	el.save()

	let e = new TokenReserve(token.symbol.concat('-').concat(createEventID(event)))
	e.transaction = transaction.id
	e.timestamp   = event.block.timestamp
	e.token       = event.params.token.toHex()
	e.reserve     = tokenValue(event.params.reserve, token.decimals as u8)
	e.profit      = tokenValue(event.params.profit, token.decimals as u8)
	e.loss        = tokenValue(event.params.loss, token.decimals as u8)
	e.save()
}
