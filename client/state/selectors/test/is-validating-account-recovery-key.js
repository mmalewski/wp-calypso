/** @format */

/**
 * External dependencies
 */
import { assert } from 'chai';
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import isValidatingAccountRecoveryKey from 'state/selectors/is-validating-account-recovery-key';

describe( 'isValidatingAccountRecoveryKey()', () => {
	test( 'should return the requesting field under the validate substate tree.', () => {
		const state = deepFreeze( {
			accountRecovery: {
				reset: {
					validate: {
						isRequesting: true,
					},
				},
			},
		} );

		assert.isTrue( isValidatingAccountRecoveryKey( state ) );
	} );

	test( 'should return false as the default value.', () => {
		assert.isFalse( isValidatingAccountRecoveryKey( undefined ) );
	} );
} );
