/**
 * `modules/ads` data store: settings.
 *
 * Site Kit by Google, Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import invariant from 'invariant';

/**
 * Internal dependencies
 */
import API from 'googlesitekit-api';
import { createStrictSelect } from '../../../googlesitekit/data/utils';
import {
	INVARIANT_DOING_SUBMIT_CHANGES,
	INVARIANT_SETTINGS_NOT_CHANGED,
} from '../../../googlesitekit/data/create-settings-store';
import { CORE_SITE } from '../../../googlesitekit/datastore/site/constants';
import { MODULES_ADS } from './constants';
import { isValidConversionID } from '../utils/validation';

// Invariant error messages.
export const INVARIANT_INVALID_CONVERSION_ID =
	'a valid conversionID is required to submit changes';

export async function submitChanges( { select, dispatch } ) {
	const haveSettingsChanged = select( MODULES_ADS ).haveSettingsChanged();
	const haveConversionTrackingSettingsChanged =
		select( CORE_SITE ).haveConversionTrackingSettingsChanged();

	// This action shouldn't be called if settings haven't changed,
	// but this prevents errors in tests.
	if ( haveSettingsChanged || haveConversionTrackingSettingsChanged ) {
		// Since conversion tracking settings are module agnostic we need to check
		// if conversion tracking can be updated individually, or together with Ads settings.
		if ( haveSettingsChanged ) {
			const { error } = await dispatch( MODULES_ADS ).saveSettings();
			if ( error ) {
				return { error };
			}

			if ( haveConversionTrackingSettingsChanged ) {
				const { error: conversionTrackingError } = await dispatch(
					CORE_SITE
				).saveConversionTrackingSettings();

				if ( conversionTrackingError ) {
					return { conversionTrackingError };
				}
			}
		} else if ( haveConversionTrackingSettingsChanged ) {
			const { error } = await dispatch(
				CORE_SITE
			).saveConversionTrackingSettings();

			if ( error ) {
				return { error };
			}
		}
	}

	await API.invalidateCache( 'modules', 'ads' );

	return {};
}

export function validateCanSubmitChanges( select ) {
	const strictSelect = createStrictSelect( select );
	const { isDoingSubmitChanges, haveSettingsChanged, getConversionID } =
		strictSelect( MODULES_ADS );

	invariant( ! isDoingSubmitChanges(), INVARIANT_DOING_SUBMIT_CHANGES );
	invariant( haveSettingsChanged(), INVARIANT_SETTINGS_NOT_CHANGED );

	invariant(
		isValidConversionID( getConversionID() ),
		INVARIANT_INVALID_CONVERSION_ID
	);
}
