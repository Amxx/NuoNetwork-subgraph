import {
	Token,
	KyberTrade,
	UniswapTrade,
} from '../generated/schema'

import {
	LogTrade as LogTradeEventKyber,
} from '../generated/KyberConnector/KyberConnector'

import {
	LogTrade as LogTradeEventUniswap,
} from '../generated/UniswapConnector/UniswapConnector'

import {
	logTransaction,
	createEventID,
	fetchToken,
	decimalValue,
} from './utils'

export function handleLogTradeKyber(event: LogTradeEventKyber): void
{
	let sToken = fetchToken(event.params._srcToken)
	let dToken = fetchToken(event.params._destToken)

	let e = new KyberTrade(createEventID(event))
	e.transaction       = logTransaction(event).id
	e.timestamp         = event.block.timestamp
	e.from              = event.params._from
	e.srcToken          = sToken.id
	e.destToken         = dToken.id
	e.srcTokenValue     = decimalValue(event.params._srcTokenValue,     sToken.decimals)
	e.srcTokenValueLeft = decimalValue(event.params._srcTokenValueLeft, sToken.decimals)
	e.destTokenValue    = decimalValue(event.params._destTokenValue,    dToken.decimals)
	e.destTokenValueMax = decimalValue(event.params._maxDestTokenValue, dToken.decimals)
	e.exchangeRate      = decimalValue(event.params._exchangeRate,      18)
	e.save()
}

export function handleLogTradeUniswap(event: LogTradeEventUniswap): void
{
	let sToken = fetchToken(event.params._srcToken)
	let dToken = fetchToken(event.params._destToken)

	let e = new UniswapTrade(createEventID(event))
	e.transaction       = logTransaction(event).id
	e.timestamp         = event.block.timestamp
	e.from              = event.params._from
	e.srcToken          = sToken.id
	e.destToken         = dToken.id
	e.srcTokenValue     = decimalValue(event.params._srcTokenValue,     sToken.decimals)
	e.srcTokenValueLeft = decimalValue(event.params._srcTokenValueLeft, sToken.decimals)
	e.destTokenValue    = decimalValue(event.params._destTokenValue,    dToken.decimals)
	e.destTokenValueMax = decimalValue(event.params._maxDestTokenValue, dToken.decimals)
	e.exchangeRate      = decimalValue(event.params._exchangeRate,      18)
	e.save()
}
