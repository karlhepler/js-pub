var Pub = require('../src/Pub.js');
var pub = new Pub({}, '/public');

describe('Pub', function() {

	it('can return the public path', function() {
		expect( pub.path() ).toBe('/public');
	});

	it('can return a path within the public path', function() {
		expect( pub.path('bar.jpg') ).toBe('/public/bar.jpg');
		expect( pub.path('/bar.jpg') ).toBe('/public/bar.jpg');
		expect( pub.path('images/bar.jpg') ).toBe('/public/images/bar.jpg');
		expect( pub.path('/images/bar.jpg') ).toBe('/public/images/bar.jpg');
		expect( pub.path('/images/') ).toBe('/public/images');
	});

	it('can add paths', function() {
		pub.addPath('tpl', 'assets/templates');
		pub.addPath('img', '/images/');
		pub.addPath({'fnt': '/assets/front-end/fonts'});
		pub.addPath({
			'js': 'builds/scripts/',
			'css': '/builds/css'
		});

		expect( pub.path() ).toBe('/public');
		expect( pub.tpl() ).toBe('/public/assets/templates');
		expect( pub.tpl('test.html') ).toBe('/public/assets/templates/test.html');
		expect( pub.img() ).toBe('/public/images');
		expect( pub.img('test.jpg') ).toBe('/public/images/test.jpg');
		expect( pub.fnt() ).toBe('/public/assets/front-end/fonts');
		expect( pub.fnt('myfont.otf') ).toBe('/public/assets/front-end/fonts/myfont.otf');
		expect( pub.js() ).toBe('/public/builds/scripts');
		expect( pub.js('app.js') ).toBe('/public/builds/scripts/app.js');
		expect( pub.css() ).toBe('/public/builds/css');
		expect( pub.css('app.css') ).toBe('/public/builds/css/app.css');
	});

	it('can create global pub functions', function() {
		Pub.globalize({
			'templates': 'angular/templates',
			'images': 'static-assets/images',
			'scripts': 'builds/scripts'
		}, '/public');

		expect( global.templates('test.html') ).toBe('/public/angular/templates/test.html');
		expect( global.images('test.jpg') ).toBe('/public/static-assets/images/test.jpg');
		expect( global.scripts('test.js') ).toBe('/public/builds/scripts/test.js');
	});

});
