<?php
/**
 * Class Google\Site_Kit\Core\Conversion_Tracking\Conversion_Events_Providers\OptinMonster
 *
 * @package   Google\Site_Kit\Core\Conversion_Tracking\Conversion_Events_Providers
 * @copyright 2024 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Core\Conversion_Tracking\Conversion_Events_Providers;

use Google\Site_Kit\Core\Assets\Script;
use Google\Site_Kit\Core\Conversion_Tracking\Conversion_Events_Provider;

/**
 * Class for handling OptinMonster conversion events.
 *
 * @since n.e.x.t
 * @access private
 * @ignore
 */
class OptinMonster extends Conversion_Events_Provider {

	const CONVERSION_EVENT_PROVIDER_SLUG = 'optin-monster';

	/**
	 * Checks if the OptinMonster plugin is active.
	 *
	 * @since n.e.x.t
	 *
	 * @return bool True if OptinMonster is active, false otherwise.
	 */
	public function is_active() {
		return defined( 'OMAPI_FILE' );
	}

	/**
	 * Gets the conversion event names that are tracked by this provider.
	 *
	 * @since n.e.x.t
	 *
	 * @return array List of event names.
	 */
	public function get_event_names() {
		return array( 'submit_lead_form' );
	}

	/**
	 * Registers the script for the provider.
	 *
	 * @since n.e.x.t
	 *
	 * @return Script Script instance.
	 */
	public function register_script() {
		$script = new Script(
			'gsk-cep-' . self::CONVERSION_EVENT_PROVIDER_SLUG,
			array(
				'src'       => $this->context->url( 'dist/assets/js/optin-monster.js' ),
				'execution' => 'async',
			)
		);

		$script->register( $this->context );

		return $script;
	}

}
