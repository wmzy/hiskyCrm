require.config({
	baseUrl: '/js',
	paths: {
		'jquery': 'lib/jquery-2.1.1.min',
		'bootstrap': 'lib/bootstrap.min',
		'jstree': 'lib/jstree.min',
		'selectize': 'lib/selectize.min'
	},
	shim: {
		'selectize': {
			deps: ['jquery']
		},
		'bootstrap': {
			deps: ['jquery']
		}
	}
});

require(
	document.getElementById('#scripts').getAttribute('data-async').split(',')
);

require(['jquery'], function($) {

	'use strict';

	$(function() {
		require($('#scripts').data('foot').split(','));
	});

});
