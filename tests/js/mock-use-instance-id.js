/**
 * Utilities for mocking the `useInstanceId()` hook.
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
 * External dependencies
 */
import faker from 'faker';

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { useInstanceId } from '@wordpress/compose';

/**
 * Provides a unique, memoized ID.
 *
 * @since 1.107.0
 *
 * @param {Object} object Object reference to create an ID for. This is unused and only included for compatibility with the original `useInstanceId()`.
 * @param {string} prefix Prefix for the unique ID.
 * @return {string} The unique ID.
 */
function useMemoizedID( object, prefix ) {
	return useMemo( () => {
		const id = faker.datatype.uuid();
		return prefix ? `${ prefix }-${ id }` : id;
	}, [ prefix ] );
}

/**
 * Mocks the `useInstanceId()` hook.
 *
 * This is necessary to ensure that the instance IDs generated by the hook are predictable during tests.
 * The original version of `useInstanceId()` in `@wordpress/compose` uses a `WeakMap` to track object references.
 * It appears that these can be garbage collected at different times during test runs on CI vs local, possibly
 * due to differing memory constraints. This results in different instance IDs being generated, which causes
 * instability in test snapshots.
 *
 * @since 1.107.0
 */
export function mockUseInstanceID() {
	beforeAll( () => {
		// Note that `useInstanceId()` is a Jest spy, having been spied on in the global `@wordpress/compose` mock.
		useInstanceId.mockImplementation( useMemoizedID );
	} );

	afterAll( () => {
		useInstanceId.mockRestore();
	} );
}