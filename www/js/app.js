// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app',
				Reveal: 'reveal/js/reveal',
				d3: 'd3/d3.v2',
				nvd3: 'nvd3'
    },
		shim: {
			Reveal: {
				exports: 'Reveal'
			},
			d3: {
				exports: 'd3'
			},
			nvd3: {
				deps: ['d3'],
				exports: 'nv'
			},
		}
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['app/main']);
