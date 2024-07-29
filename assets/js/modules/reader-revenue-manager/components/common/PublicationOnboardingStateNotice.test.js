/**
 * Reader Revenue Manager PublicationOnboardingStateNotice component tests.
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
 * Internal dependencies.
 */
import {
	createTestRegistry,
	provideUserAuthentication,
	provideUserInfo,
	render,
} from '../../../../../../tests/js/test-utils';

import {
	MODULES_READER_REVENUE_MANAGER,
	PUBLICATION_ONBOARDING_STATES,
} from '../../datastore/constants';
import PublicationOnboardingStateNotice from './PublicationOnboardingStateNotice';

describe( 'PublicationOnboardingStateNotice', () => {
	let registry;

	const {
		ONBOARDING_ACTION_REQUIRED,
		ONBOARDING_COMPLETE,
		PENDING_VERIFICATION,
	} = PUBLICATION_ONBOARDING_STATES;

	beforeEach( () => {
		registry = createTestRegistry();
		provideUserAuthentication( registry );
		provideUserInfo( registry );
	} );

	it( 'should not render the component when state is not PENDING_VERIFICATION or ONBOARDING_ACTION_REQUIRED', () => {
		registry
			.dispatch( MODULES_READER_REVENUE_MANAGER )
			.receiveGetSettings( {
				publicationID: 'ABCDEFGH',
				publicationOnboardingState: ONBOARDING_COMPLETE,
				publicationOnboardingStateLastSyncedAtMs: 0,
			} );

		const { container } = render( <PublicationOnboardingStateNotice />, {
			registry,
		} );

		expect( container ).toBeEmptyDOMElement();
	} );

	it( 'should render the "Check publication status" CTA with correct link', async () => {
		registry
			.dispatch( MODULES_READER_REVENUE_MANAGER )
			.receiveGetSettings( {
				publicationID: 'ABCDEFGH',
				publicationOnboardingState: PENDING_VERIFICATION,
				publicationOnboardingStateLastSyncedAtMs: 0,
			} );

		const { container, getByText, waitForRegistry } = render(
			<PublicationOnboardingStateNotice />,
			{
				registry,
			}
		);

		await waitForRegistry();

		const expectedServiceURL = registry
			.select( MODULES_READER_REVENUE_MANAGER )
			.getServiceURL( {
				path: '/reader-revenue-manager',
				publicationID: 'ABCDEFGH',
			} );

		// Ensure that CTA is present and class name is correct.
		expect( getByText( 'Check publication status' ) ).toBeInTheDocument();
		expect(
			container.querySelector( '.googlesitekit-settings-notice__button' )
		).toBeInTheDocument();

		expect(
			container.querySelector(
				'.googlesitekit-cta-link.googlesitekit-cta-link--inverse'
			)
		).toHaveAttribute( 'href', expectedServiceURL );

		expect( container.firstChild ).toHaveClass(
			'googlesitekit-publication-onboarding-state-notice'
		);
	} );

	it.each( [
		[
			'Your publication requires further setup in Reader Revenue Manager',
			ONBOARDING_ACTION_REQUIRED,
		],
		[
			'Your publication is still awaiting review. you can check its status in Reader Revenue Manager.',
			PENDING_VERIFICATION,
		],
	] )(
		'should render the component text "%s" when state is %s',
		async ( expectedText, publicationState ) => {
			registry
				.dispatch( MODULES_READER_REVENUE_MANAGER )
				.receiveGetSettings( {
					publicationID: 'ABCDEFGH',
					publicationOnboardingState: publicationState,
					publicationOnboardingStateLastSyncedAtMs: 0,
				} );

			const { getByText, waitForRegistry } = render(
				<PublicationOnboardingStateNotice />,
				{
					registry,
				}
			);

			await waitForRegistry();

			expect( getByText( expectedText ) ).toBeInTheDocument();
		}
	);
} );
