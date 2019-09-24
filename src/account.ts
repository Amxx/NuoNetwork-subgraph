import { store } from '@graphprotocol/graph-ts'

import {
	Token,
	Account,
	User,
	AccountUser,
	LogImplChanged,
	LogTransferBySystem,
	LogTransferByUser,
	LogUserAdded,
	LogUserRemoved,
} from '../generated/schema'

import {
	LogImplChanged      as LogImplChangedEvent,
	LogTransferBySystem as LogTransferBySystemEvent,
	LogTransferByUser   as LogTransferByUserEvent,
	LogUserAdded        as LogUserAddedEvent,
	LogUserRemoved      as LogUserRemovedEvent,
} from '../generated/templates/Account/Account'

import {
	createEventID,
	createAccountUserID,
} from './utils'

export function handleLogImplChanged(event: LogImplChangedEvent): void
{
	let e = new LogImplChanged(createEventID(event))
	e.transaction = event.transaction.hash
	e.timestamp   = event.block.timestamp
	e.blockNumber = event.block.number
	e.account     = event.address.toHex()
	e.newImpl     = event.params.newImpl
	e.oldImpl     = event.params.oldImpl
	e.save()
}

export function handleLogTransferBySystem(event: LogTransferBySystemEvent): void
{
	let token = new Token(event.params.token.toHex())
	token.save()

	let e = new LogTransferBySystem(createEventID(event))
	e.transaction = event.transaction.hash
	e.timestamp   = event.block.timestamp
	e.blockNumber = event.block.number
	e.token       = token.id
	e.from        = event.address.toHex()
	e.to          = event.params.to
	e.value       = event.params.value
	e.by          = event.params.by
	e.save()
}

export function handleLogTransferByUser(event: LogTransferByUserEvent): void
{
	let token = new Token(event.params.token.toHex())
	token.save()

	let e = new LogTransferBySystem(createEventID(event))
	e.transaction = event.transaction.hash
	e.timestamp   = event.block.timestamp
	e.blockNumber = event.block.number
	e.token       = token.id
	e.from        = event.address.toHex()
	e.to          = event.params.to
	e.value       = event.params.value
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

	let e = new LogUserAdded(createEventID(event))
	e.transaction = event.transaction.hash
	e.timestamp   = event.block.timestamp
	e.blockNumber = event.block.number
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

	let e = new LogUserRemoved(createEventID(event))
	e.transaction = event.transaction.hash
	e.timestamp   = event.block.timestamp
	e.blockNumber = event.block.number
	e.account     = event.address.toHex()
	e.user        = user.id
	e.by          = event.params.by
	e.save()
}
