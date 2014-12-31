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

require(['bootstrap'].concat(
	document.getElementById('scripts').getAttribute('data-files').split(/[,;: ]/)
));

