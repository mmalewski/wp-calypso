/** @format */

/**
 * Internal Dependencies
 */

import { APPLY_STORED_STATE } from 'state/action-types';
import { getStateFromLocalStorage } from 'state/initial-state';

export const addReducerToStore = store => async ( key, reducer ) => {
	store.addReducer( key, reducer );

	const { storageKey } = reducer;
	if ( ! storageKey ) {
		return;
	}

	const storedState = await getStateFromLocalStorage( storageKey );
	if ( ! storedState ) {
		return;
	}

	store.dispatch( { type: APPLY_STORED_STATE, storageKey, storedState } );
};
