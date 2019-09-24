import {
	Account,
	User,
	AccountUser,
} from '../generated/schema'

import {
	Account as AccountTemplate
} from '../generated/templates'

import {
	LogAccountCreated as LogAccountCreatedEvent,
} from '../generated/AccountFactory/AccountFactory'

import {
	LogAccountCreated as LogAccountCreatedV2Event,
} from '../generated/AccountFactoryV2/AccountFactoryV2'

import {
	createEventID,
	createAccountUserID,
} from './utils'

export function handleLogAccountCreated(event: LogAccountCreatedEvent): void
{
	let account = new Account(event.params.account.toHex())
	account.save()

	let user = new User(event.params.user.toHex())
	user.save()

	let accountuser = new AccountUser(createAccountUserID(account.id, user.id))
	accountuser.account = account.id
	accountuser.user    = user.id
	accountuser.save()

	AccountTemplate.create(event.params.account)
}

export function handleLogAccountCreatedV2(event: LogAccountCreatedV2Event): void
{
	let account = new Account(event.params.account.toHex())
	account.save()

	let user = new User(event.params.user.toHex())
	user.save()

	let accountuser = new AccountUser(createAccountUserID(account.id, user.id))
	accountuser.account = account.id
	accountuser.user    = user.id
	accountuser.save()

	AccountTemplate.create(event.params.account)
}
