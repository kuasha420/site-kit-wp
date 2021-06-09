/**
 * Settings notice SettingsNoticeSingleRow component.
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
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { TYPE_WARNING, TYPE_INFO, TYPE_SUGGESTION, getIconFromType } from './utils';

const SettingsNoticeSingleRow = ( {
	notice,
	type,
	Icon,
	LearnMore,
} ) => {
	return (
		<div
			className="googlesitekit-settings-notice__row"
		>
			<div className="googlesitekit-settings-notice__icon">
				{ Icon ? <Icon /> : getIconFromType( type ) }
			</div>
			<div className="googlesitekit-settings-notice--single-row__inner-row">
				<div className="googlesitekit-settings-notice__text">
					{ notice }
				</div>
				{ LearnMore && (
					<div className="googlesitekit-settings-notice__learn-more--single-row">
						<LearnMore />
					</div>
				) }
			</div>
		</div>
	);
};

export default SettingsNoticeSingleRow;

SettingsNoticeSingleRow.propTypes = {
	notice: PropTypes.node.isRequired,
	type: PropTypes.oneOf( [ TYPE_WARNING, TYPE_INFO, TYPE_SUGGESTION ] ),
	Icon: PropTypes.elementType,
	LearnMore: PropTypes.elementType,
};