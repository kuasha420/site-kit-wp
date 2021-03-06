/**
 * Header component for ModuleOverviewWidget.
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
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';
import { __, sprintf, _n, _x } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	MODULES_SEARCH_CONSOLE,
	DATE_RANGE_OFFSET,
} from '../../../datastore/constants';
import { CORE_USER } from '../../../../../googlesitekit/datastore/user/constants';
import { generateDateRangeArgs } from '../../../util';
import WidgetHeaderTitle from '../../../../../googlesitekit/widgets/components/WidgetHeaderTitle';
import WidgetHeaderCTA from '../../../../../googlesitekit/widgets/components/WidgetHeaderCTA';
import Data from 'googlesitekit-data';
const { useSelect } = Data;

const Header = ( { metrics, selectedStats } ) => {
	const dateRangeDates = useSelect( ( select ) =>
		select( CORE_USER ).getDateRangeDates( {
			offsetDays: DATE_RANGE_OFFSET,
		} )
	);
	const searchConsoleDeepLink = useSelect( ( select ) =>
		select( MODULES_SEARCH_CONSOLE ).getServiceReportURL( {
			metrics: metrics[ selectedStats ]?.metric,
			...generateDateRangeArgs( dateRangeDates ),
		} )
	);
	const currentDayCount = useSelect( ( select ) =>
		select( CORE_USER ).getDateRangeNumberOfDays()
	);

	return (
		<Fragment>
			<WidgetHeaderTitle
				title={ sprintf(
					/* translators: %s: number of days */
					_n(
						'Overview for the last %s day',
						'Overview for the last %s days',
						currentDayCount,
						'google-site-kit'
					),
					currentDayCount
				) }
			/>
			<WidgetHeaderCTA
				href={ searchConsoleDeepLink }
				label={ sprintf(
					/* translators: %s: module name. */
					__( 'See full stats in %s', 'google-site-kit' ),
					_x( 'Search Console', 'Service name', 'google-site-kit' )
				) }
			/>
		</Fragment>
	);
};

Header.propTypes = {
	metrics: PropTypes.arrayOf( PropTypes.object ),
	selectedStats: PropTypes.number.isRequired,
};

export default Header;
