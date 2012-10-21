define(["require", "exports", "Reveal", "lodash"], function(require, exports, __Reveal___, __lodash__) {
    
    
    var Reveal_ = __Reveal___;

    var Reveal = Reveal_;
    var lodash = __lodash__;

    var _ = lodash;
    Reveal.initialize({
        controls: true,
        progress: true,
        mouseWheel: false,
        history: true,
        theme: Reveal.getQueryHash().theme || 'default',
        transition: Reveal.getQueryHash().transition || 'linear'
    });
    exports.g = {
    };
    exports.f = {
    };
    require([
        "app/graphs", 
        "app/quant", 
        "app/evolution", 
        "d3", 
        "nvd3"
    ], function (graphs, quant, evolution, d3, nv) {
        var tout = null;
        function show(slide) {
            slide.select("svg").transition().delay(100).call(exports.g[slide.attr("id")]);
        }
        function fragDispatch() {
            var i = 0;
            var sel = d3.select(Reveal.getCurrentSlide()).selectAll(".fragment.visible").each(function () {
                i += 1;
            });
            var act = d3.select(Reveal.getCurrentSlide()).attr("id") + "." + i;
            if(exports.f[act]) {
                exports.f[act]();
            }
        }
        d3.select(".reveal").on("slidechanged", function () {
            d3.selectAll(".reveal svg *").remove();
            show(d3.select(Reveal.getCurrentSlide()));
            fragDispatch();
        });
        d3.select(".reveal").on("fragmentshown", fragDispatch);
        d3.select(".reveal").on("fragmenthidden", fragDispatch);
        var g1 = nv.models.lineChart();
        g1.x(function (d, i) {
            return i;
        });
        g1.y(function (d, i) {
            return d;
        });
        g1.xAxis.axisLabel('Historia').tickFormat(d3.format(',r'));
        g1.yAxis.axisLabel('Entropia').tickFormat(d3.format(',r'));
        g1.forceY([
            0, 
            2
        ]);
        exports.f["g1.0"] = function () {
            quant.giveTalk('11', function (talk) {
                var e = new quant.EntropyAnalysis(talk);
                var es = new quant.EntropyAnalysis(_.shuffle(talk));
                d3.select("#g1 svg").datum([
                    {
                        key: 'normal',
                        values: e.entropies()
                    }, 
                    {
                        key: 'randomized',
                        values: es.entropies()
                    }
                ]);
                g1.update();
            });
        };
        exports.g["g1"] = g1;
        exports.f["g1.1"] = function () {
            quant.giveTalk('12', function (talk) {
                var e = new quant.EntropyAnalysis(talk);
                var es = new quant.EntropyAnalysis(_.shuffle(talk));
                d3.select("#g1 svg").datum([
                    {
                        key: 'normal',
                        values: e.entropies()
                    }, 
                    {
                        key: 'randomized',
                        values: es.entropies()
                    }
                ]);
                g1.update();
            });
        };
        var g2 = graphs.RrPlot();
        var sig = "AABACABABABC";
        exports.f["rrplot.0"] = function () {
            g2.signal(sig);
            g2.rrify(1);
            g2.update();
            d3.select("#rrplot p").selectAll("span").data(_.map(sig)).enter().append("span").text(function (d) {
                return d;
            });
            d3.select("#rrplot p").selectAll("span").style("color", "white");
        };
        exports.f["rrplot.1"] = function () {
            g2.signal(sig);
            g2.rrify(1, [
                "A"
            ]);
            g2.update();
            d3.select("#rrplot p").selectAll("span").data(_.map(sig)).enter().append("span").text(function (d) {
                return d;
            });
            d3.select("#rrplot p").selectAll("span").style("color", function (d) {
                return (d == 'A' ? "red" : "white");
            });
        };
        exports.f["rrplot.2"] = exports.f["rrplot.0"];
        exports.f["rrplot.3"] = function () {
            g2.signal(sig);
            g2.rrify(2);
            g2.update();
            d3.select("#rrplot p").selectAll("span").data(_.map(sig)).enter().append("span").text(function (d) {
                return d;
            });
            d3.select("#rrplot p").selectAll("span").style("color", "white");
        };
        exports.f["rrplot.4"] = function () {
            g2.signal(sig);
            g2.rrify(3);
            g2.update();
            d3.select("#rrplot p").selectAll("span").data(_.map(sig)).enter().append("span").text(function (d) {
                return d;
            });
            d3.select("#rrplot p").selectAll("span").style("color", "white");
        };
        exports.g["rrplot"] = g2;
        var evg = nv.models.lineChart().width(600).height(500);
        exports.f["evolution.0"] = function () {
            evolution.give(function (ev) {
                d3.select("#evolution svg").datum(ev.field("RR3").byTalk());
                evg.xAxis.axisLabel("Pozycja");
                evg.yAxis.axisLabel("RR3");
                evg.x(function (d) {
                    return d.position;
                });
                evg.y(function (d) {
                    return (d.value);
                });
                evg.forceY([
                    0, 
                    0.25
                ]);
                evg.update();
                evg.forceX([
                    0, 
                    100
                ]);
            });
        };
        exports.f["evolution.1"] = function () {
            evolution.give(function (ev) {
                d3.select("#evolution svg").datum(ev.field("RR3").byTalk());
                evg.xAxis.axisLabel("Czas");
                evg.yAxis.axisLabel("RR3");
                evg.x(function (d) {
                    return (d.time);
                });
                evg.y(function (d) {
                    return (d.value);
                });
                evg.forceY([
                    0, 
                    0.25
                ]);
                evg.update();
                evg.forceX([
                    0, 
                    100
                ]);
            });
        };
        exports.f["evolution.2"] = function () {
            evolution.give(function (ev) {
                d3.select("#evolution svg").datum(_.filter(ev.field("RR3").byTalk(), function (o) {
                    return o.variance > 0.0005;
                }));
                evg.xAxis.axisLabel("Czas");
                evg.yAxis.axisLabel("RR3");
                evg.x(function (d) {
                    return (d.time);
                });
                evg.y(function (d) {
                    return (d.value);
                });
                evg.forceY([
                    0, 
                    0.25
                ]);
                evg.update();
                evg.forceX([
                    0, 
                    100
                ]);
            });
        };
        exports.f["evolution.3"] = function () {
            evolution.give(function (ev) {
                d3.select("#evolution svg").datum(_.filter(ev.field("RR3").byTalk(), function (o) {
                    return o.variance < 0.00003;
                }));
                evg.xAxis.axisLabel("Czas");
                evg.yAxis.axisLabel("RR3");
                evg.forceY([
                    0, 
                    0.25
                ]);
                evg.x(function (d) {
                    return (d.time);
                });
                evg.y(function (d) {
                    return (d.value);
                });
                evg.update();
                evg.forceX([
                    0, 
                    100
                ]);
            });
        };
        exports.g["evolution"] = evg;
        var g3 = nv.models.lineWithFocusChart();
        g3.xAxis.axisLabel('Czas').tickFormat(d3.format(',r'));
        g3.yAxis.axisLabel('Częstotliwość').tickFormat(d3.format(',r'));
        quant.giveFreq('11', function (freq) {
            var data = _.chain(freq).map(function (v, i) {
                return {
                    x: i / 10,
                    y: (v > 0) ? v : null
                };
            }).value();
            d3.select("#g3 svg").datum([
                {
                    key: '11',
                    values: data
                }
            ]);
            exports.g["g3"] = g3;
        });
    });
})

