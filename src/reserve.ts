import { store } from '@graphprotocol/graph-ts'

import {
	ReserveOrder,
	ReserveOrderCancelled,
	ReserveOrderCumulativeUpdate,
	ReserveValuesUpdated,
} from '../generated/schema'

import {
	LogOrderCreated           as LogOrderCreatedEvent,
	LogOrderCancelled         as LogOrderCancelledEvent,
	LogOrderCumulativeUpdated as LogOrderCumulativeUpdatedEvent,
	LogReserveValuesUpdated   as LogReserveValuesUpdatedEvent,
} from '../generated/Reserve/Reserve'

import {
	createEventID,
} from './utils'

export function handleLogOrderCreated(event: LogOrderCreatedEvent): void
{
	let order = new ReserveOrder(event.params.orderHash.toHex())
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
}

export function handleLogOrderCancelled(event: LogOrderCancelledEvent): void
{
	let order = new ReserveOrder(event.params.orderHash.toHex())
	order.status = 'CLOSED'
	order.save()

	let e = new ReserveOrderCancelled(createEventID(event))
	e.order     = order.id
	e.timestamp = event.block.timestamp
	e.by        = event.params.by
	e.save()
}

export function handleLogOrderCumulativeUpdated(event: LogOrderCumulativeUpdatedEvent): void
{
	let order = new ReserveOrder(event.params.orderHash.toHex())
	order.cumulativeValue     = event.params.value
	order.cumulativeTimestamp = event.params.updatedTill
	order.save()

	let e = new ReserveOrderCumulativeUpdate(createEventID(event))
	e.order     = order.id
	e.timestamp = event.block.timestamp
	e.value     = event.params.value
	e.save()
}

export function handleLogReserveValuesUpdated(event: LogReserveValuesUpdatedEvent): void
{
	let e = new ReserveValuesUpdated(createEventID(event))
	e.token     = event.params.token.toHex()
	e.timestamp = event.block.timestamp
	e.reserve   = event.params.reserve
	e.profit    = event.params.profit
	e.loss      = event.params.loss
	e.save()
}
