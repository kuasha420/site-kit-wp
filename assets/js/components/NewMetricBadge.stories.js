/**
 * NewMetricBadge Component Stories.
 *
 * Site Kit by Google, Copyright 2023 Google LLC
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
import NewMetricBadge from './NewMetricBadge';

const Template = ( args ) => <NewMetricBadge { ...args } />;

export const NewMetricBadgeDefault = Template.bind( {} );
NewMetricBadgeDefault.storyName = 'Default';
NewMetricBadgeDefault.args = {
	tooltipTitle: 'This is a tooltip title',
	learnMoreLink: 'https://www.google.com',
};

export const NewMetricBadgeLongTitle = Template.bind( {} );
NewMetricBadgeLongTitle.storyName = 'Long Title';
NewMetricBadgeLongTitle.args = {
	tooltipTitle:
		'This is a tooltip title that is very long and will wrap to multiple lines. This should still display as a single paragraph and the link will be displayed under the title.',
	learnMoreLink: 'https://www.google.com',
};

export default {
	title: 'Components/NewMetricBadge',
	component: NewMetricBadge,
	decorators: [
		( Story ) => (
			<div
				style={ {
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'flex-end',
					height: '200px',
				} }
			>
				<Story />
			</div>
		),
	],
};
