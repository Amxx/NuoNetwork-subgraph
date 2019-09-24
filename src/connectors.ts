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
	tokenValue,
} from './utils'

export function handleLogTradeKyber(event: LogTradeEventKyber): void
{
	let srcToken  = Token.load(event.params._srcToken.toHex())
	let destToken = Token.load(event.params._destToken.toHex())

	let e = new KyberTrade(createEventID(event))
	e.transaction       = logTransaction(event).id
	e.timestamp         = event.block.timestamp
	e.from              = event.params._from
	e.srcToken          = srcToken.id
	e.destToken         = destToken.id
	e.srcTokenValue     = tokenValue(event.params._srcTokenValue,     srcToken.decimals as u8)
	e.srcTokenValueLeft = tokenValue(event.params._srcTokenValueLeft, srcToken.decimals as u8)
	e.destTokenValue    = tokenValue(event.params._destTokenValue,    destToken.decimals as u8)
	e.destTokenValueMax = tokenValue(event.params._maxDestTokenValue, destToken.decimals as u8)
	e.exchangeRate      = event.params._exchangeRate
	e.save()
}

export function handleLogTradeUniswap(event: LogTradeEventUniswap): void
{
	let srcToken  = Token.load(event.params._srcToken.toHex())
	let destToken = Token.load(event.params._destToken.toHex())

	let e = new UniswapTrade(createEventID(event))
	e.transaction       = logTransaction(event).id
	e.timestamp         = event.block.timestamp
	e.from              = event.params._from
	e.srcToken          = srcToken.id
	e.destToken         = destToken.id
	e.srcTokenValue     = tokenValue(event.params._srcTokenValue,     srcToken.decimals as u8)
	e.srcTokenValueLeft = tokenValue(event.params._srcTokenValueLeft, srcToken.decimals as u8)
	e.destTokenValue    = tokenValue(event.params._destTokenValue,    destToken.decimals as u8)
	e.destTokenValueMax = tokenValue(event.params._maxDestTokenValue, destToken.decimals as u8)
	e.exchangeRate      = event.params._exchangeRate
	e.save()
}
