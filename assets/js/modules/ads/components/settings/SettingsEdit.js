/**
 * Ads Settings Edit component.
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
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { ProgressBar } from 'googlesitekit-components';
import { MODULES_ADS } from '../../datastore/constants';
import { CORE_MODULES } from '../../../../googlesitekit/modules/datastore/constants';
import SettingsForm from './SettingsForm';
const { useSelect } = Data;

export default function SettingsEdit() {
	const isDoingSubmitChanges = useSelect( ( select ) =>
		select( MODULES_ADS ).isDoingSubmitChanges()
	);

	const hasAdsAccess = useSelect( ( select ) =>
		select( CORE_MODULES ).hasModuleOwnershipOrAccess( 'ads' )
	);

	let viewComponent;
	if ( isDoingSubmitChanges || hasAdsAccess === undefined ) {
		viewComponent = <ProgressBar />;
	} else {
		viewComponent = <SettingsForm hasModuleAccess={ hasAdsAccess } />;
	}

	return (
		<div className="googlesitekit-setup-module googlesitekit-setup-module--ads">
			{ viewComponent }
		</div>
	);
}
