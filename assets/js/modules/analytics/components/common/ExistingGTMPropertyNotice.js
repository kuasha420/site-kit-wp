/**
 * Analytics Existing GTM Property Notice component.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
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
 * WordPress dependencies
 */
import { sprintf, __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { MODULES_ANALYTICS } from '../../datastore/constants';
import { MODULES_TAGMANAGER } from '../../../tagmanager/datastore/constants';
const { useSelect } = Data;

export default function ExistingGTMPropertyNotice() {
	const propertyID = useSelect( ( select ) =>
		select( MODULES_ANALYTICS ).getPropertyID()
	);

	const gtmAnalyticsPropertyID = useSelect( ( select ) =>
		select( MODULES_TAGMANAGER ).getSingleAnalyticsPropertyID()
	);

	if ( ! gtmAnalyticsPropertyID ) {
		return null;
	}

	if ( gtmAnalyticsPropertyID === propertyID ) {
		return (
			<p>
				{ sprintf(
					/* translators: %s: GTM property ID */
					__(
						'An existing Google Tag Manager property was found on your site with the ID %s. Since it refers to the same property selected here, Site Kit will not place its own tag and rely on the existing one. If later on you decide to remove this property, Site Kit can place a new tag for you.',
						'google-site-kit'
					),
					gtmAnalyticsPropertyID
				) }
			</p>
		);
	}

	return (
		<p>
			{ sprintf(
				/* translators: %s: GTM property ID */
				__(
					'An existing Google Tag Manager property was found on your site with the ID %s.',
					'google-site-kit'
				),
				gtmAnalyticsPropertyID
			) }
		</p>
	);
}
