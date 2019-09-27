import {
	Address,
} from '@graphprotocol/graph-ts'

import {
	Token,
	MarginOrder,
	MarginOrderCreated,
	MarginOrderLiquidatedByUser,
	MarginOrderStoppedAtProfit,
	MarginOrderDefaulted,
	MarginSettlement,
} from '../generated/schema'

import {
	MKernel                  as MKernelContract,
	LogOrderCreated          as LogOrderCreatedEvent,
	LogOrderLiquidatedByUser as LogOrderLiquidatedByUserEvent,
	LogOrderStoppedAtProfit  as LogOrderStoppedAtProfitEvent,
	LogOrderDefaulted        as LogOrderDefaultedEvent,
	LogNoActionPerformed     as LogNoActionPerformedEvent,
	LogOrderSettlement       as LogOrderSettlementEvent,
} from '../generated/MKernel/MKernel'

import {
	logTransaction,
	createEventID,
	fetchToken,
	decimalValue,
} from './utils'

export function handleLogOrderCreated(event: LogOrderCreatedEvent): void
{
	let mkernel = MKernelContract.bind(event.address)

	let mto   = new MarginOrder(event.params.orderHash.toHex())
	let order = mkernel.getOrder(event.params.orderHash)
	let trade = mkernel.getTrade(event.params.orderHash)

	let pToken = fetchToken(order.value2)
	let cToken = fetchToken(order.value3)

	mto.status              = 'ACTIVE'
	mto.account             = order.value0.toHex()
	mto.byUser              = order.value1.toHex()
	mto.principalToken      = pToken.id
	mto.principalAmount     = decimalValue(order.value4, pToken.decimals)
	mto.collateralToken     = cToken.id
	mto.collateralAmount    = decimalValue(order.value5, cToken.decimals)
	mto.tradeToken          = trade.value0.toHex()
	mto.closingToken        = trade.value1.toHex()
	mto.exchangeConnector   = trade.value2
	mto.stopProfit          = decimalValue(trade.value3, 18)
	mto.stopLoss            = decimalValue(trade.value4, 18)
	mto.premium             = decimalValue(order.value6, pToken.decimals)
	mto.fee                 = decimalValue(order.value9, pToken.decimals)
	mto.createdTimestamp    = order.value10
	mto.expirationTimestamp = order.value7
	mto.salt                = order.value8
	mto.save()

	let e = new MarginOrderCreated(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.order       = mto.id
	e.save()
}

export function handleLogOrderLiquidatedByUser(event: LogOrderLiquidatedByUserEvent): void
{
	let mto = new MarginOrder(event.params.orderHash.toHex())
	mto.status = 'LIQUIDATED'
	mto.save()

	let e = new MarginOrderLiquidatedByUser(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.order       = mto.id
	e.save()
}

export function handleLogOrderStoppedAtProfit(event: LogOrderStoppedAtProfitEvent): void
{
	let mto = new MarginOrder(event.params.orderHash.toHex())
	mto.status = 'STOPPED'
	mto.save()

	let e = new MarginOrderStoppedAtProfit(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.order       = mto.id
	e.save()
}

export function handleLogOrderDefaulted(event: LogOrderDefaultedEvent): void
{
	let mto = new MarginOrder(event.params.orderHash.toHex())
	mto.status = 'DEFAULTED'
	mto.save()

	let e = new MarginOrderDefaulted(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.order       = mto.id
	e.reason      = event.params.reason
	e.save()
}

export function handleLogOrderSettlement(event: LogOrderSettlementEvent): void
{
	let mto = MarginOrder.load(event.params.orderHash.toHex())

	let pToken       = fetchToken(Address.fromString(mto.principalToken))
	let cToken       = fetchToken(Address.fromString(mto.collateralToken))
	let closingToken = fetchToken(Address.fromString(mto.closingToken))

	let e = new MarginSettlement(createEventID(event))
	e.transaction    = logTransaction(event).id
	e.timestamp      = event.block.timestamp
	e.order          = mto.id
	e.valueRepaid    = decimalValue(event.params.valueRepaid,    pToken.decimals)
	e.reserveProfit  = decimalValue(event.params.reserveProfit,  pToken.decimals)
	e.reserveLoss    = decimalValue(event.params.reserveLoss,    pToken.decimals)
	e.collateralLeft = decimalValue(event.params.collateralLeft, cToken.decimals)
	e.userProfit     = decimalValue(event.params.userProfit,     closingToken.decimals)
	e.fee            = decimalValue(event.params.fee,            pToken.decimals)
	e.save()
}
