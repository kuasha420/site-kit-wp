/**
 * `modules/analytics-4` data store: webdatastreams tests.
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
 * Internal dependencies
 */
import API from 'googlesitekit-api';
import { createTestRegistry, muteFetch, subscribeUntil, unsubscribeFromAll } from 'tests/js/utils';
import { MODULES_ANALYTICS_4 } from './constants';
import * as fixtures from './__fixtures__';

describe( 'modules/analytics-4 webdatastreams', () => {
	let registry;

	const createWebDataStreamsEndpoint = /^\/google-site-kit\/v1\/modules\/analytics-4\/data\/create-webdatastream/;
	const webDataStreamsEndpoint = /^\/google-site-kit\/v1\/modules\/analytics-4\/data\/webdatastreams/;

	beforeAll( () => {
		API.setUsingCache( false );
	} );

	beforeEach( () => {
		registry = createTestRegistry();
		// Receive empty settings to prevent unexpected fetch by resolver.
		registry.dispatch( MODULES_ANALYTICS_4 ).receiveGetSettings( {} );
	} );

	afterAll( () => {
		API.setUsingCache( true );
	} );

	afterEach( () => {
		unsubscribeFromAll( registry );
	} );

	describe( 'actions', () => {
		describe( 'createWebDataStream', () => {
			it( 'should create a web datastream and add it to the store', async () => {
				const propertyID = '12345';

				fetchMock.post( createWebDataStreamsEndpoint, {
					body: fixtures.createWebDataStream,
					status: 200,
				} );

				await registry.dispatch( MODULES_ANALYTICS_4 ).createWebDataStream( propertyID );
				expect( fetchMock ).toHaveFetched( createWebDataStreamsEndpoint, {
					body: {
						data: {
							propertyID,
						},
					},
				} );

				const webdatastreams = registry.select( MODULES_ANALYTICS_4 ).getWebDataStreams( propertyID );
				expect( webdatastreams ).toMatchObject( [ fixtures.createWebDataStream ] );
			} );

			it( 'should dispatch an error if the request fails', async () => {
				const propertyID = '12345';
				const response = {
					code: 'internal_server_error',
					message: 'Internal server error',
					data: { status: 500 },
				};

				fetchMock.post( createWebDataStreamsEndpoint, {
					body: response,
					status: 500,
				} );

				await registry.dispatch( MODULES_ANALYTICS_4 ).createWebDataStream( propertyID );

				const error = registry.select( MODULES_ANALYTICS_4 ).getErrorForAction( 'createWebDataStream', [ propertyID ] );
				expect( error ).toMatchObject( response );

				// The response isn't important for the test here and we intentionally don't wait for it,
				// but the fixture is used to prevent an invariant error as the received webdatastreams
				// taken from `response.webDataStreams` are required to be an array.
				muteFetch( webDataStreamsEndpoint, fixtures.webDataStreams );

				const webdatastreams = registry.select( MODULES_ANALYTICS_4 ).getWebDataStreams( propertyID );
				// No webdatastreams should have been added yet, as the property creation failed.
				expect( webdatastreams ).toBeUndefined();
				expect( console ).toHaveErrored();
			} );
		} );
	} );

	describe( 'selectors', () => {
		describe( 'getWebDataStreams', () => {
			it( 'should use a resolver to make a network request', async () => {
				fetchMock.get( webDataStreamsEndpoint, {
					body: fixtures.webDataStreams,
					status: 200,
				} );

				const propertyID = '12345';
				const initialProperties = registry.select( MODULES_ANALYTICS_4 ).getWebDataStreams( propertyID );

				await subscribeUntil( registry, () => registry.select( MODULES_ANALYTICS_4 ).hasStartedResolution( 'getWebDataStreams', [ propertyID ] ) );
				expect( fetchMock ).toHaveFetched( webDataStreamsEndpoint, { query: { propertyID } } );

				expect( initialProperties ).toBeUndefined();
				await subscribeUntil( registry, () => registry.select( MODULES_ANALYTICS_4 ).getWebDataStreams( propertyID ) !== undefined );

				const webdatastreams = registry.select( MODULES_ANALYTICS_4 ).getWebDataStreams( propertyID );
				expect( fetchMock ).toHaveFetchedTimes( 1 );
				expect( webdatastreams ).toEqual( fixtures.webDataStreams.webDataStreams );
				expect( webdatastreams ).toHaveLength( fixtures.webDataStreams.webDataStreams.length );
			} );

			it( 'should not make a network request if webdatastreams for this account are already present', async () => {
				const testPropertyID = '12345';
				const propertyID = testPropertyID;

				// Load data into this store so there are matches for the data we're about to select,
				// even though the selector hasn't fulfilled yet.
				registry.dispatch( MODULES_ANALYTICS_4 ).receiveGetWebDataStreams( fixtures.webDataStreams, { propertyID } );

				const webdatastreams = registry.select( MODULES_ANALYTICS_4 ).getWebDataStreams( testPropertyID );
				await subscribeUntil( registry, () => registry.select( MODULES_ANALYTICS_4 ).hasFinishedResolution( 'getWebDataStreams', [ testPropertyID ] ) );

				// It _may_ make a request for profiles internally if not loaded,
				// so we only care that it did not fetch webdatastreams here.
				expect( fetchMock ).not.toHaveFetched( webDataStreamsEndpoint );
				expect( webdatastreams ).toEqual( fixtures.webDataStreams.webDataStreams );
				expect( webdatastreams ).toHaveLength( fixtures.webDataStreams.webDataStreams.length );
			} );

			it( 'should dispatch an error if the request fails', async () => {
				const response = {
					code: 'internal_server_error',
					message: 'Internal server error',
					data: { status: 500 },
				};

				fetchMock.getOnce( webDataStreamsEndpoint, {
					body: response,
					status: 500,
				} );

				const fakePropertyID = '777888999';
				registry.select( MODULES_ANALYTICS_4 ).getWebDataStreams( fakePropertyID );
				await subscribeUntil( registry, () => registry.select( MODULES_ANALYTICS_4 ).hasFinishedResolution( 'getWebDataStreams', [ fakePropertyID ] ) );
				expect( fetchMock ).toHaveFetchedTimes( 1 );

				const webdatastreams = registry.select( MODULES_ANALYTICS_4 ).getWebDataStreams( fakePropertyID );
				expect( webdatastreams ).toBeUndefined();
				expect( console ).toHaveErrored();
			} );
		} );
	} );
} );
