define(["require", "exports", "lodash", "d3"], function(require, exports, __lodash__, __d3___) {
    
    
    var lodash = __lodash__;

    var _ = lodash;
    var d3_ = __d3___;

    var d3 = d3_;
    var RealNode = (function () {
        function RealNode(ch, w) {
            this.wght = 0;
            if(ch) {
                this.children = _.clone(ch);
            } else {
                this.children = {
                };
            }
            if(w) {
                this.wght = w;
            }
        }
        RealNode.prototype.add = function (s, pos) {
            if(pos == s.length) {
                this.wght += 1;
            } else {
                if(this.children[s[pos]]) {
                    this.children[s[pos]] = this.children[s[pos]].add(s, pos + 1);
                } else {
                    this.children[s[pos]] = new PseudoNode(s, pos + 1);
                }
            }
            return this;
        };
        RealNode.prototype.entropies = function () {
            var es = _.chain(this.children).values().map(function (n) {
                return n.entropies();
            });
            var weights = es.pluck('w');
            var sw = weights.reduce(function (a, b) {
                return a + b;
            }).value();
            if(sw == 0) {
                return {
                    w: this.wght,
                    e: []
                };
            }
            var se = [
                weights.filter(function (w) {
                    return w > 0;
                }).map(function (w) {
                    return (Math.log(sw / w) * w);
                }).reduce(function (a, b) {
                    return a + b;
                }).value() / Math.log(2)
            ];
            var sew = [
                sw
            ];
            es.forEach(function (x) {
                for(var i = 0; i < x.e.length; ++i) {
                    se[i + 1] = (se[i + 1] || 0) + x.e[i];
                }
                for(var i = 0; i < x.ew.length; ++i) {
                    sew[i + 1] = (sew[i + 1] || 0) + x.ew[i];
                }
            });
            return {
                w: sw + this.wght,
                e: se,
                ew: sew,
                d: 0
            };
        };
        return RealNode;
    })();    
    var PseudoNode = (function () {
        function PseudoNode(cs, cpos) {
            this.cs = cs;
            this.cpos = cpos;
        }
        PseudoNode.prototype.add = function (s, pos) {
            var nch = {
            };
            var w = 1;
            if(this.cpos < this.cs.length) {
                nch[this.cs[this.cpos]] = new PseudoNode(this.cs, this.cpos + 1);
                w = 0;
            }
            return (new RealNode(nch, w)).add(s, pos);
        };
        PseudoNode.prototype.entropies = function () {
            return {
                e: [],
                ew: _.map(_.range(0, this.cs.length - this.cpos), function () {
                    return 1;
                }),
                w: 1
            };
        };
        return PseudoNode;
    })();    
    var EntropyAnalysis = (function () {
        function EntropyAnalysis(signal) {
            this.root = new RealNode();
            for(var i = 0; i < signal.length; ++i) {
                this.root = this.root.add(signal, i);
            }
        }
        EntropyAnalysis.prototype.entropies = function () {
            var e = this.root.entropies();
            e.ew.length = e.e.length;
            return _.map(_.zip(e.e, e.ew), function (x) {
                return x[0] / x[1];
            });
        };
        return EntropyAnalysis;
    })();
    exports.EntropyAnalysis = EntropyAnalysis;    
    function giveTalk(id, callback) {
        var url = require.toUrl("./data/sig4_" + "00".substring(0, 2 - id.length) + id + ".");
        url = url.substring(0, url.length - 1);
        d3.text(url, function (text) {
            var talk = _.map(d3.csv.parseRows(text), function (t) {
                return t[0];
            });
            callback(talk);
        });
    }
    exports.giveTalk = giveTalk;
    function giveFreq(id, callback) {
        var url = require.toUrl("./data/p" + "00".substring(0, 2 - id.length) + id + "_f.");
        url = url.substring(0, url.length - 1);
        d3.text(url, function (text) {
            var talk = _.map(d3.csv.parseRows(text), function (t) {
                return t[0];
            });
            callback(talk.slice(1, talk.length));
        });
    }
    exports.giveFreq = giveFreq;
})

