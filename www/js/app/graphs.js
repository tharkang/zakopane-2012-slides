define(["require", "exports", 'd3', 'lodash'], function(require, exports, __d3___, __lodash__) {
    
    ; ;
    
    ; ;
    var d3_ = __d3___;

    var d3 = d3_;
    var lodash = __lodash__;

    var _ = lodash;
    var LinePlot = (function () {
        function LinePlot(svgId) {
            var _this = this;
            var margin = {
                top: 10,
                right: 10,
                bottom: 20,
                left: 30
            };
            var svg = d3.select(svgId);
            var width = svg.attr("width") - margin.left - margin.right;
            var height = svg.attr("height") - margin.top - margin.bottom;
            this.x = d3.scale.linear().domain([
                0, 
                30
            ]).range([
                0, 
                width
            ]);
            this.y = d3.scale.linear().domain([
                0, 
                2
            ]).range([
                height, 
                0
            ]);
            var xAxis = d3.svg.axis().scale(this.x).orient("bottom");
            var yAxis = d3.svg.axis().scale(this.y).orient("left");
            this.line = d3.svg.line().x(function (d) {
                return _this.x(d.x);
            }).y(function (d) {
                return _this.y(d.y);
            });
            svg = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            this.svg = svg;
            svg.append("g").attr("class", "x axis").attr("transform", "translate(0, " + height + ")").call(xAxis);
            svg.append("g").attr("class", "y axis").call(yAxis);
        }
        LinePlot.prototype.addLine = function (key, data) {
            this.svg.append("path").datum(data).attr("class", "line " + key).attr("d", this.line);
            this.svg.selectAll(".dot." + key).data(data).enter().append("circle").attr("class", "dot " + key).attr("cx", this.line.x()).attr("cy", this.line.y()).attr("r", 3.5);
        };
        return LinePlot;
    })();
    exports.LinePlot = LinePlot;    
    function RrPlot() {
        var margin;
        var x;
        var y;
        var svg;
        var s1 = [];
        var s2 = [];
        var xAxis;
        var yAxis;
        var zoomBh;
        var png;
        margin = {
            top: 20,
            right: 10,
            bottom: 10,
            left: 30
        };
        x = d3.scale.linear();
        y = d3.scale.linear();
        xAxis = d3.svg.axis().scale(x).orient("top");
        yAxis = d3.svg.axis().scale(y).orient("left");
        function getPng(emb, sel) {
            var z = 6;
            var canvas = document.createElement("canvas");
            canvas.height = s1.length * z;
            canvas.width = s2.length * z;
            var context = canvas.getContext("2d");
            for(var x = 0; x < s1.length; ++x) {
                for(var y = 0; y < s2.length; ++y) {
                    if(x >= emb - 1 && y >= emb - 1 && _.chain().range(emb).all(function (i) {
                        return s1[x - i] == s2[y - i];
                    }).value()) {
                        if(sel && sel.length == emb && _.chain().range(emb).all(function (i) {
                            return (s1[x - i] == sel[emb - 1 - i]);
                        }).value()) {
                            context.setFillColor("red");
                        } else {
                            context.setFillColor("black");
                        }
                    } else {
                        context.setFillColor("white");
                    }
                    context.fillRect(z * x, z * y, z, z);
                }
            }
            return canvas.toDataURL();
        }
        function zoom() {
            var e = d3.event;
            if(e.translate[0] > 0 || e.translate[1] > 0) {
                zoomBh.translate([
                    e.translate[0] > 0 ? 0 : e.translate[0], 
                    e.translate[1] > 0 ? 0 : e.translate[1]
                ]);
                zoomBh.update();
            }
            var t = zoomBh.translate();
            var sc = zoomBh.scale();
            e.translate = t;
            svg.select(".x.axis").call(xAxis);
            svg.select(".y.axis").call(yAxis);
            svg.select("g.rrplot").attr("transform", "translate(" + t[0] + "," + t[1] + ") scale(" + sc + ")");
        }
        function chart(selection) {
            selection.each(function () {
                svg = d3.select(this);
                var width = parseInt(svg.style("width")) - margin.left - margin.right;
                var height = parseInt(svg.style("height")) - margin.top - margin.bottom;
                x.domain([
                    0, 
                    width / 30
                ]).range([
                    0, 
                    width
                ]);
                y.domain([
                    0, 
                    height / 30
                ]).range([
                    0, 
                    height
                ]);
                xAxis.tickSize(-height);
                yAxis.tickSize(-width);
                var zsvg = svg;
                zoomBh = d3.behavior.zoom().x(x).y(y).scaleExtent([
                    0.2, 
                    5
                ]).on("zoom", zoom);
                zsvg.call(zoomBh);
                svg.append("clipPath").attr("id", "dupa").append("rect").attr("width", width).attr("height", height);
                svg = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                svg.append("g").attr("class", "y axis").call(yAxis);
                svg.append("g").attr("class", "x axis").call(xAxis);
                svg.append("g").attr("clip-path", "url(#dupa)").append("g").attr("class", "rrplot");
                svg.select("g.rrplot").append("image").attr("height", 30 * s1.length).attr("width", 30 * s2.length).attr("xlink:href", png);
            });
            var chart_ = chart;
            chart_.update = function () {
                svg.select("g.rrplot image").attr("height", 30 * s1.length).attr("width", 30 * s2.length).attr("xlink:href", png);
            };
        }
        var chart_ = chart;
        chart_.update = function () {
        };
        chart_.rrify = function (embedding, sel) {
            var emb = (arguments.length > 0 ? embedding : 1);
            png = getPng(embedding, sel);
        };
        chart_.signal = function (s1_, s2_) {
            if(arguments.length == 0) {
                return [
                    s1, 
                    s2
                ];
            }
            s1 = s1_;
            s2 = (arguments.length > 1) ? s2_ : s1_;
        };
        return chart;
    }
    exports.RrPlot = RrPlot;
    ; ;
})

