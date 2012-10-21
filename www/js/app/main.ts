declare module "Reveal" {}
declare module "lodash" {}

declare var require: {
	(name, dependencies, factory): any;
	(dependencies, factory): any;
}

import Reveal_ = module("Reveal");
var Reveal: any = Reveal_;

import lodash = module("lodash");
var _: any = lodash;

Reveal.initialize({
	controls: true,
	progress: true,
	mouseWheel: false,
	history: true,

	theme: Reveal.getQueryHash().theme || 'default', // available themes are in /css/theme
	transition: Reveal.getQueryHash().transition || 'linear', // default/cube/page/concave/linear(2d)

	/*// Optional libraries used to extend on reveal.js
	dependencies: [
	{ src: 'lib/js/highlight.js', async: true, callback: function() { window.hljs.initHighlightingOnLoad(); } },
	{ src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
	{ src: 'lib/js/showdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
	{ src: 'lib/js/data-markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
	{ src: '/socket.io/socket.io.js', async: true, condition: function() { return window.location.host === 'localhost:1947'; } },
	{ src: 'plugin/speakernotes/client.js', async: true, condition: function() { return window.location.host === 'localhost:1947'; } },
	]*/
});

export var g = {};
export var f = {};

require(["app/graphs", "app/quant", "app/evolution", "d3", "nvd3"], (graphs, quant, evolution, d3, nv) => {

	var tout = null;
	function show(slide) {
		slide.select("svg").transition().delay(100).call(g[slide.attr("id")]);
	}

	function fragDispatch() {
		//alert("fire");
		var i = 0;
		var sel = d3.select(Reveal.getCurrentSlide()).selectAll(".fragment.visible").each(function(){i += 1;});

		var act = d3.select(Reveal.getCurrentSlide()).attr("id") + "." + i;

		if(f[act]) f[act]();
	}

	d3.select(".reveal").on("slidechanged", () => { d3.selectAll(".reveal svg *").remove(); show(d3.select(Reveal.getCurrentSlide())); fragDispatch();});

	d3.select(".reveal").on("fragmentshown", fragDispatch);
	d3.select(".reveal").on("fragmenthidden", fragDispatch);

	var g1 = nv.models.lineChart();
	g1.x((d, i) => i);
	g1.y((d, i) => d);
	g1.xAxis.axisLabel('Historia').tickFormat(d3.format(',r'));
	g1.yAxis.axisLabel('Entropia').tickFormat(d3.format(',r'));
	g1.forceY([0,2]);

	f["g1.0"] = function() {
		quant.giveTalk('11', (talk) => {
			var e = new quant.EntropyAnalysis(talk);
			var es = new quant.EntropyAnalysis(_.shuffle(talk));
			d3.select("#g1 svg").datum([{key: 'normal', values: e.entropies()}, {key: 'randomized', values: es.entropies()}]);
			//nv.addGraph(g1);
			g1.update();
		});
	};

	g["g1"] = g1;

	f["g1.1"] = function () {
		quant.giveTalk('12', (talk) => {
			var e = new quant.EntropyAnalysis(talk);
			var es = new quant.EntropyAnalysis(_.shuffle(talk));
			d3.select("#g1 svg").datum([{key: 'normal', values: e.entropies()}, {key: 'randomized', values: es.entropies()}]);
			g1.update();
		});
	};

	var g2 = graphs.RrPlot();

	/*quant.giveTalk('11', (talk) => {
		g2.signal(talk.slice(0,300));
		g2.update();
	});*/
	var sig = "AABACABABABC";

	f["rrplot.0"] = function() {
		g2.signal(sig);
		g2.rrify(1);
		g2.update();
		d3.select("#rrplot p").selectAll("span").data(_.map(sig)).enter().append("span").text(function(d){return d;});
		d3.select("#rrplot p").selectAll("span").style("color", "white")
	};
	f["rrplot.1"] = function() {
		g2.signal(sig);
		g2.rrify(1, ["A"]);
		g2.update();
		d3.select("#rrplot p").selectAll("span").data(_.map(sig)).enter().append("span").text(function(d){return d;});
		d3.select("#rrplot p").selectAll("span").style("color", function(d){return (d=='A'?"red":"white");})
	};
	f["rrplot.2"] = f["rrplot.0"]
	f["rrplot.3"] = function() {
		g2.signal(sig);
		g2.rrify(2);
		g2.update();
		d3.select("#rrplot p").selectAll("span").data(_.map(sig)).enter().append("span").text(function(d){return d;});
		d3.select("#rrplot p").selectAll("span").style("color", "white")
	};
	f["rrplot.4"] = function() {
		g2.signal(sig);
		g2.rrify(3);
		g2.update();
		d3.select("#rrplot p").selectAll("span").data(_.map(sig)).enter().append("span").text(function(d){return d;});
		d3.select("#rrplot p").selectAll("span").style("color", "white")
	};
	g["rrplot"] = g2;

	var evg = nv.models.lineChart().width(600).height(500);

	f["evolution.0"] = function() {
		evolution.give(function(ev) {
			d3.select("#evolution svg").datum(ev.field("RR3").byTalk());
			evg.xAxis.axisLabel("Pozycja");
			evg.yAxis.axisLabel("RR3");
			evg.x(function(d) { return d.position; });
			evg.y(function(d) { return (d.value); });
			evg.forceY([0, 0.25]);
			evg.update();
			evg.forceX([0, 100]);
		});
	}

	f["evolution.1"] = function() {
		evolution.give(function(ev) {
			d3.select("#evolution svg").datum(ev.field("RR3").byTalk());
			evg.xAxis.axisLabel("Czas");
			evg.yAxis.axisLabel("RR3");
			evg.x(function(d) { return (d.time); });
			evg.y(function(d) { return (d.value); });
			evg.forceY([0, 0.25]);
			evg.update();
			evg.forceX([0, 100]);
		});
	}

	f["evolution.2"] = function() {
		evolution.give(function(ev) {
		d3.select("#evolution svg").datum(_.filter(ev.field("RR3").byTalk(), function(o){return o.variance > 5E-4;}));
			evg.xAxis.axisLabel("Czas");
			evg.yAxis.axisLabel("RR3");
			evg.x(function(d) { return (d.time); });
			evg.y(function(d) { return (d.value); });
			evg.forceY([0, 0.25]);
			evg.update();
			evg.forceX([0, 100]);
		});
	}

	f["evolution.3"] = function() {
		evolution.give(function(ev) {
		d3.select("#evolution svg").datum(_.filter(ev.field("RR3").byTalk(), function(o){return o.variance < 3E-5;}));
			evg.xAxis.axisLabel("Czas");
			evg.yAxis.axisLabel("RR3");
			evg.forceY([0, 0.25]);
			evg.x(function(d) { return (d.time); });
			evg.y(function(d) { return (d.value); });
			evg.update();
			evg.forceX([0, 100]);
		});
	}

	g["evolution"] = evg;

	var g3 = nv.models.lineWithFocusChart();
	g3.xAxis.axisLabel('Czas').tickFormat(d3.format(',r'));
	g3.yAxis.axisLabel('Częstotliwość').tickFormat(d3.format(',r'));

	quant.giveFreq('11', (freq) => {
		var data = _.chain(freq).map((v, i) => {return {x: i/10.0, y: (v > 0) ? v : null}}).value();
		d3.select("#g3 svg").datum([{key: '11', values: data}]);
		//nv.addGraph(g1);
		g["g3"] = g3;
	});

});
