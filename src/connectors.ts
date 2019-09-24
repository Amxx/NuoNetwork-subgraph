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
} from './utils'

export function handleLogTradeKyber(event: LogTradeEventKyber): void
{
	let e = new KyberTrade(createEventID(event))
	e.transaction       = logTransaction(event).id
	e.timestamp         = event.block.timestamp
	e.from              = event.params._from
	e.srcToken          = event.params._srcToken.toHex()
	e.destToken         = event.params._destToken.toHex()
	e.srcTokenValue     = event.params._srcTokenValue
	e.srcTokenValueLeft = event.params._srcTokenValueLeft
	e.destTokenValue    = event.params._destTokenValue
	e.destTokenValueMax = event.params._maxDestTokenValue
	e.exchangeRate      = event.params._exchangeRate
	e.save()
}

export function handleLogTradeUniswap(event: LogTradeEventUniswap): void
{
	let e = new UniswapTrade(createEventID(event))
	e.transaction       = logTransaction(event).id
	e.timestamp         = event.block.timestamp
	e.from              = event.params._from
	e.srcToken          = event.params._srcToken.toHex()
	e.destToken         = event.params._destToken.toHex()
	e.srcTokenValue     = event.params._srcTokenValue
	e.srcTokenValueLeft = event.params._srcTokenValueLeft
	e.destTokenValue    = event.params._destTokenValue
	e.destTokenValueMax = event.params._maxDestTokenValue
	e.exchangeRate      = event.params._exchangeRate
	e.save()
}
