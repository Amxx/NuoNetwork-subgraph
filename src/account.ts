import { store } from '@graphprotocol/graph-ts'

import {
	Token,
	Account,
	User,
	AccountUser,
	AccountImplChanged,
	AccountTransferBySystem,
	AccountTransferByUser,
	AccountUserAdded,
	AccountUserRemoved,
} from '../generated/schema'

import {
	LogImplChanged      as LogImplChangedEvent,
	LogTransferBySystem as LogTransferBySystemEvent,
	LogTransferByUser   as LogTransferByUserEvent,
	LogUserAdded        as LogUserAddedEvent,
	LogUserRemoved      as LogUserRemovedEvent,
} from '../generated/templates/Account/Account'

import {
	logTransaction,
	createAccountUserID,
	createEventID,
	fetchToken,
	decimalValue,
} from './utils'

export function handleLogImplChanged(event: LogImplChangedEvent): void
{
	let e = new AccountImplChanged(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.account     = event.address.toHex()
	e.newImpl     = event.params.newImpl
	e.oldImpl     = event.params.oldImpl
	e.save()
}

export function handleLogTransferBySystem(event: LogTransferBySystemEvent): void
{
	let token = fetchToken(event.params.token)

	let e = new AccountTransferBySystem(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.token       = token.id
	e.from        = event.address.toHex()
	e.to          = event.params.to
	e.value       = decimalValue(event.params.value, token.decimals)
	e.by          = event.params.by
	e.save()
}

export function handleLogTransferByUser(event: LogTransferByUserEvent): void
{
	let token = fetchToken(event.params.token)

	let e = new AccountTransferByUser(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.token       = token.id
	e.from        = event.address.toHex()
	e.to          = event.params.to
	e.value       = decimalValue(event.params.value, token.decimals)
	e.by          = event.params.by
	e.save()
}

export function handleLogUserAdded(event: LogUserAddedEvent): void
{
	let user = new User(event.params.user.toHex())
	user.save()

	let accountuser = new AccountUser(createAccountUserID(event.address.toHex(), user.id))
	accountuser.account = event.address.toHex()
	accountuser.user    = user.id
	accountuser.save()

	let e = new AccountUserAdded(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.account     = event.address.toHex()
	e.user        = user.id
	e.by          = event.params.by
	e.save()
}

export function handleLogUserRemoved(event: LogUserRemovedEvent): void
{
	let user = new User(event.params.user.toHex())
	user.save()

	store.remove('AccountUser', createAccountUserID(event.address.toHex(), user.id))

	let e = new AccountUserRemoved(createEventID(event))
	e.transaction = logTransaction(event).id
	e.timestamp   = event.block.timestamp
	e.account     = event.address.toHex()
	e.user        = user.id
	e.by          = event.params.by
	e.save()
}
