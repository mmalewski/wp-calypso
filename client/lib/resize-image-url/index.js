/** @format */

/**
 * External dependencies
 */

import { get, assign, omit, includes, mapValues, findKey } from 'lodash';
import { parse, format } from 'url';

/**
 * Internal dependencies
 */
import safeImageUrl from 'lib/safe-image-url';

/**
 * Pattern matching valid http(s) URLs
 *
 * @type {RegExp}
 */
const REGEXP_VALID_PROTOCOL = /^https?:$/;

/**
 * Factor by which dimensions should be multiplied, specifically accounting for
 * high pixel-density displays (e.g. retina). This multiplier currently maxes
 * at 2x image size, though could foreseeably be the exact display ratio.
 *
 * @type {Number}
 */
const IMAGE_SCALE_FACTOR =
	get( typeof window !== 'undefined' && window, 'devicePixelRatio', 1 ) > 1 ? 2 : 1;

/**
 * Query parameters to be treated as image dimensions
 *
 * @type {String[]}
 */
const SIZE_PARAMS = [ 'w', 'h', 'resize', 'fit', 's' ];

/**
 * Mappings of supported safe services to patterns by which they can be matched
 *
 * @type {Object}
 */
const SERVICE_HOSTNAME_PATTERNS = {
	photon: /(^[is]\d\.wp\.com|(^|\.)wordpress\.com)$/,
	gravatar: /(^|\.)gravatar\.com$/,
};

/**
 * Given a numberic value, returns the value multiplied by image scale factor
 *
 * @param  {Number} value Original value
 * @return {Number}       Updated value
 */
const scaleByFactor = value => value * IMAGE_SCALE_FACTOR;

/**
 * Changes the sizing parameters on a URL. Works for WordPress.com, Photon, and
 * Gravatar images.
 *
 * NOTE: Original query string arguments will be stripped from WordPress.com
 * and Photon images, and preserved for Gravatar images. If an external image
 * URL containing query string arguments is passed to this function, it will
 * return `null`.
 *
 * @param   {String}          imageUrl Original image url
 * @param   {(Number|Object)} resize   Resize pixel width, or object of query
 *                                     arguments (assuming Photon or Gravatar)
 * @param   {?Number}         height   Pixel height if specifying resize width
 * @param   {?Boolean}        makeSafe Should we make sure this is on a safe host?
 * @returns {?String}                  Resized image URL, or `null` if unable to resize
 */
export default function resizeImageUrl( imageUrl, resize, height, makeSafe = true ) {
	if ( 'string' !== typeof imageUrl ) {
		return imageUrl;
	}

	const parsedUrl = parse( imageUrl, true, true );
	if ( ! REGEXP_VALID_PROTOCOL.test( parsedUrl.protocol ) ) {
		return imageUrl;
	}
	if ( ! parsedUrl.hostname ) {
		// no hostname? must be a bad url.
		return imageUrl;
	}

	parsedUrl.query = omit( parsedUrl.query, SIZE_PARAMS );

	const service = findKey(
		SERVICE_HOSTNAME_PATTERNS,
		String.prototype.match.bind( parsedUrl.hostname )
	);

	if ( 'number' === typeof resize ) {
		if ( 'gravatar' === service ) {
			resize = { s: resize };
		} else {
			resize = height > 0 ? { fit: [ resize, height ].join() } : { w: resize };
		}
	}

	// External URLs are made "safe" (i.e. passed through Photon), so
	// recurse with an assumed set of query arguments for Photon
	if ( ! service && makeSafe ) {
		return resizeImageUrl( safeImageUrl( imageUrl ), resize, null, false );
	}

	// Map sizing parameters, multiplying their values by the scale factor
	assign(
		parsedUrl.query,
		mapValues( resize, ( value, key ) => {
			if ( 'resize' === key || 'fit' === key ) {
				return value
					.split( ',' )
					.map( scaleByFactor )
					.join( ',' );
			} else if ( includes( SIZE_PARAMS, key ) ) {
				return scaleByFactor( value );
			}

			return value;
		} )
	);

	delete parsedUrl.search;

	return format( parsedUrl );
}
