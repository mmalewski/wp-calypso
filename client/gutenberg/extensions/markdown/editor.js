/** @format */

/**
 * External dependencies
 */
import { ExternalLink } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';
import edit from './edit';
import save from './save';
import { __ } from 'gutenberg/extensions/presets/jetpack/utils/i18n';
import registerJetpackBlock from 'gutenberg/extensions/presets/jetpack/utils/register-jetpack-block';

export const name = 'markdown';

export const settings = {
	title: __( 'Markdown' ),

	description: (
		<Fragment>
			<p>{ __( 'Use regular characters and punctuation to style text, links, and lists.' ) }</p>
			<ExternalLink href="https://en.support.wordpress.com/markdown-quick-reference/">
				{ __( 'Support reference' ) }
			</ExternalLink>
		</Fragment>
	),

	icon: (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 208 128">
			<rect
				width="198"
				height="118"
				x="5"
				y="5"
				ry="10"
				stroke="currentColor"
				strokeWidth="10"
				fill="none"
			/>
			<path d="M30 98v-68h20l20 25 20-25h20v68h-20v-39l-20 25-20-25v39zM155 98l-30-33h20v-35h20v35h20z" />
		</svg>
	),

	category: 'jetpack',

	keywords: [ __( 'formatting' ), __( 'syntax' ), __( 'markup' ) ],

	attributes: {
		//The Markdown source is saved in the block content comments delimiter
		source: { type: 'string' },
	},

	edit,

	save,
};

registerJetpackBlock( name, settings );
