declare module "lodash" {}
declare module "d3" {}

import lodash = module("lodash");
var _: any = lodash;

import d3_ = module("d3");
var d3: any = d3_;

declare var require: {
	(): any;
	toUrl(name: string): string;
};


interface Node {
	add(s: any, pos: number): Node;
	entropies(): {e; w;};
}

class RealNode {
	wght = 0;
	children;

	constructor(ch?, w?) {
		if(ch) {
			this.children = _.clone(ch);
		} else {
			this.children = {};
		}

		if(w) {
			this.wght = w;
		}
	}

	add(s: any, pos: number) {
		if(pos == s.length) {
			this.wght += 1;
		} else if(this.children[s[pos]]) {
			this.children[s[pos]] = this.children[s[pos]].add(s, pos + 1);
		} else {
			this.children[s[pos]] = new PseudoNode(s, pos + 1);
		}
		return this;
	}

	entropies() {
		var es = _.chain(this.children).values().map(n => n.entropies());
		var weights = es.pluck('w');
		var sw: number = weights.reduce((a, b) => a + b).value();

		if(sw == 0) {
			return {w: this.wght, e: []};
		}

		var se = [weights.filter(w => w > 0).map(w => (Math.log(sw / w) * w)).reduce((a, b) => a + b).value() / Math.log(2)];
		var sew = [sw];
		es.forEach ( x => {
			for(var i = 0; i < x.e.length; ++i) {
				se[i + 1] = (se[i + 1] || 0) + x.e[i];
			}
			for(var i = 0; i < x.ew.length; ++i) {
				sew[i + 1] = (sew[i + 1] || 0) + x.ew[i];
			}
		});
		return { w: sw + this.wght, e: se, ew: sew, d:0 };
	}

}

class PseudoNode {
	constructor(private cs: String, private cpos: number) {
	}

	add(s: String, pos: number) {
		var nch = {};
		var w = 1;

		if(this.cpos < this.cs.length) {
			nch[this.cs[this.cpos]] = new PseudoNode(this.cs, this.cpos + 1);
			w = 0;
		}
		return (new RealNode(nch, w)).add(s, pos);
	}

	entropies() {
		return { e: [], ew: _.map(_.range(0, this.cs.length - this.cpos), ()=>1), w: 1};
	}
}

export class EntropyAnalysis {
	root;
	constructor(signal) {
		this.root = new RealNode();
		for(var i = 0; i < signal.length; ++i) {
			this.root = this.root.add(signal, i);
		}
	}
	entropies() {
		var e = this.root.entropies();
		e.ew.length = e.e.length;
		return _.map(_.zip(e.e, e.ew), x => x[0]/x[1]);
	}
}

export function giveTalk(id, callback: (any) => any) {
	var url = require.toUrl("./data/sig4_" + "00".substring(0, 2-id.length) + id + ".");
	url = url.substring(0, url.length - 1);

	d3.text(url, (text) => {
		var talk = _.map(d3.csv.parseRows(text), t => t[0]);
		callback(talk);
	});
}

export function giveFreq(id, callback: (any) => any) {
	var url = require.toUrl("./data/p" + "00".substring(0, 2-id.length) + id + "_f.");
	url = url.substring(0, url.length - 1);

	d3.text(url, (text) => {
		var talk = _.map(d3.csv.parseRows(text), t => t[0]);
		callback(talk.slice(1, talk.length));
	});
}

/*class RQA {
	var lines;
	constructor(private signal1, private signal2, private metric?: (any, any) => number) {
		for(var j = -signal1.length + 1; j < signal2.length; ++j) {
			var x, y;
			if(j < 0) {
				x = -j;
				y = 0;
			} else {
				x = 0;
				y = j;
			}
			var l = 0;
			for(var k = 0; x + k < signal1.length && y + k < signal2.length; ++k) {
				if(dot(x + k, y + k)) {
					++l;
				} else if(l > 0) {
					++lines[l];
				}
			}
		}
	}
}*/
