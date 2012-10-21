define(["require", "exports", "lodash", "d3"], function(require, exports, _, d3) {
	var url = require.toUrl("./data/evolution.csv");

	var ev= null;

	exports.give = function(callback) {
		if(ev === null) {
			d3.csv(url, function(csv) {
				var ncsv = _.map(csv, function(o) { return {field: o.field, pair: o.pair, time: Number(o.time), value: Number(o.value), position: Number(o.position)};});
				ev = evolution(_.filter(ncsv, function(o) { return o.position < 100000;}));
				callback(ev);
			});
		} else {
			callback(ev);
		}
	}

	function evolution(csv) {
		var obj = {};
		obj.field = function(v) { return evolution(_.chain(csv).filter(function(o) { return o.field == v;}).value()); }
		obj.byTalk = function(v) { return _.chain(csv).groupBy(function(o) { return o.pair; }).map(function(v, k) { var ch = _.chain(v); var mean = ch.map(function(o) { return o.value;}).reduce(function(a, b){ return a+b;}).value()/v.length; var variance = ch.map(function(o) { return (o.value - mean)*(o.value - mean);}).reduce(function(a, b){ return a+b;}).value()/v.length; return { key: k, values: v, mean: mean, variance: variance}; }).value();}
		return obj;
	}
});
