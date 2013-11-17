var draw; var viewbox; var h; var w;
var two;
var people;

var streamgraph = {};

    // var generateSteamgraph = function() {

    //     for (var i=0; i<names.length; i++) {
    //         $("body").append('<div class="person" id="'+ names[i] +'">'+  names[i] +'</div>');
    //         p = new Person(names[i], $('#'+names[i]));
    //         people[names[i]] = p;

    //         for

    //         pathstring = "M 100 100 L 300 100 L 200 300 z"
    //     }

    // }  



$(document).ready(function() {


    //resize event
    $(window).resize(function() {
        w = $("body").innerWidth();
        h = $("body").innerHeight();
        for (i=0; i < names.length; i++) {
            var p = people[names[i]];
            p.updatePosition((w/11) * (i+1), h/2);
            p.reCalculatePaths();
        }
    });


    w = $("body").innerWidth();
    h = $("body").innerHeight();

    console.log(w);


    var draw = new Raphael(document.getElementById('container'), '100%', h);
    draw.path("M 0," + (h/2) + "L " + w + ',' + (h/2));
    var names = ["Alice", "Bob", "Chris", "Diana", "Ema", "Fred", "Greg", "Henry", "Iris", "Jane"];

    people = {};

    // generate relationssgips and people from the json-file
    $.getJSON( "./people.json", function( data ) {

        // generate the persons
        for (var i=0; i<names.length; i++) {
            $("body").append('<div class="person-image" id="'+ names[i] +'-image">'+  names[i] +'</div>');
            $("body").append('<div class="person" id="'+ names[i] +'">'+'</div>');

            p = new Person(names[i], $('#'+names[i]+'-image'),  $('#'+names[i]+''));
            people[names[i]] = p;
        }


        // geneates the relationships
        for (var i=0; i < names.length; i++) {
            var a = people[names[i]];
            for (var j=0; j<names.length; j++) {
                var b = people[names[j]];
                a.addRelationship(b, data[names[i]][names[j]]);
            }
        }

        // generate the paths
        for (i=0; i < names.length; i++) {
            var p = people[names[i]];
            p.updatePosition((w/11) * (i+1), h/2);
            p.generateGraphs();
            p.generatePaths();
            for( var j=0; j<p.relationships.length; j++) {
                r = p.relationships[j];
                console.log(p.name + " " + r.rel + " " + r.b.name);
            }
        }


    });

    // this defines the relationship object
    var Relationship = function(person, rel) {
        if (rel!=0) {
            this.person = person;
            this.rel = rel;

            var verb = "";

            switch(this.rel) {
                case 1:
                    verb = "knows ";
                    break;
                case 2:
                    verb = "likes ";
                    break;
                case 3:
                    verb = "doesn’t like ";
                    break;
                case 4:
                    verb = "loves ";
                    break;
                case 5:
                    verb = "doesn’t know ";
                    break;
            }
            console.log(verb+person.name);
        }
    };


    // this defines the person object
    var Person = function(name, image, button) {

        this.paths = {};
        this.graph = {};
        this.relationships = {};

        this.position = new Vec2(w/2,h/2);


        this.image = image;
        this.button = button;
        this.name = name;

        this.image.css('background-image', 'url(./images/' + name + '.png)');
        this.image.css({left:this.position.x-this.image.width()/2+'px', top:this.position.y-this.image.height()/2+'px'});
        this.button.css({left:this.position.x-this.button.width()/2+'px', top:this.position.y-this.button.height()/2+'px'});

        this.button.mouseover(function() { people[$(this).attr("id")].reCalculatePaths(); });
        this.button.mouseout(function() { people[$(this).attr("id")].hidePaths() });

        this.isKnown = 0;
        this.isLiked = 0;
        this.isDisliked = 0;
        this.isLoved = 0;
        this.isUnknown = 0;

        this.knows = 0;
        this.likes = 0;
        this.dislikes = 0;
        this.loves = 0;
        this.knowsnot = 0;
        ;

        this.generateGraphs = function() {
            var offset = 0;
            var multiplier = 30;

            $("body").append('<div class="rounded-barchart" id="isUnknown-'+ this.name +'"></div>');
            $("body").append('<div class="rounded-barchart" id="isLoved-'+ this.name +'"></div>');
            $("body").append('<div class="rounded-barchart" id="isDisliked-'+ this.name +'"></div>');
            $("body").append('<div class="rounded-barchart" id="isLiked-'+ this.name +'"></div>');
            $("body").append('<div class="rounded-barchart" id="isKnown-'+ this.name +'"></div>');


            $(".rounded-barchart").mouseover(function() {
                console.log(this);
            });


            var t = this.position.y;
            var l = this.position.x-this.image.width()/2+'px';

            offset += this.isKnown*multiplier; $('#isKnown-'+this.name).css( {backgroundColor:'#414141', height: 100+offset+'px',left:l, top:t} );
            offset += this.isLiked*multiplier; $('#isLiked-'+this.name).css( {backgroundColor:'#00A99D', height: 100+offset+'px',left:l, top:t} );
            offset += this.isDisliked*multiplier; $('#isDisliked-'+this.name).css( {backgroundColor:'#F15A24', height: 100+offset+'px',left:l, top:t} );
            offset += this.isLoved*multiplier; $('#isLoved-'+this.name).css( {backgroundColor:'#d9e021', height: 100+offset+'px',left:l, top:t} );
            offset += this.isUnknown*multiplier; $('#isUnknown-'+this.name).css( {backgroundColor:'#cecece', height: 100+offset+'px',left:l, top:t} );

            offset = 0;

            $("body").append('<div class="rounded-barchart" id="knowsnot-'+ this.name +'">&nbsp;</div>');
            $("body").append('<div class="rounded-barchart" id="loves-'+ this.name +'">&nbsp;</div>');
            $("body").append('<div class="rounded-barchart" id="dislikes-'+ this.name +'">&nbsp;</div>');
            $("body").append('<div class="rounded-barchart" id="likes-'+ this.name +'">&nbsp;</div>');
            $("body").append('<div class="rounded-barchart" id="knows-'+ this.name +'">&nbsp;</div>');

            var b = this.position.y;

            offset += this.knows*multiplier; $('#knows-'+this.name).css( {backgroundColor:'#414141', height: 100+offset+'px',left:l, bottom:b} );
            offset += this.likes*multiplier; $('#likes-'+this.name).css( {backgroundColor:'#00A99D', height: 100+offset+'px',left:l, bottom:b} );
            offset += this.dislikes*multiplier; $('#dislikes-'+this.name).css( {backgroundColor:'#F15A24', height: 100+offset+'px',left:l, bottom:b} );
            offset += this.loves*multiplier; $('#loves-'+this.name).css( {backgroundColor:'#d9e021', height: 100+offset+'px',left:l, bottom:b} );
            offset += this.knowsnot*multiplier; $('#knowsnot-'+this.name).css( {backgroundColor:'#cecece', height: 100+offset+'px',left:l, bottom:b} );
        };


        this.generatePaths = function() {

            for (var i=0; i<names.length; i++) {
                var a = this;

                //console.log(this);
                if (names[i] != this.name) {
                    //console.log(a.name);
                    console.log(this.relationships[names[i]].person)
                    var b = this.relationships[names[i]].person;
                    rel = this.relationships[names[i]].rel;

                    var strokeColor = '';

                    switch(rel) {
                        case 1:
                            strokeColor = "#414141";
                            break;
                        case 2:
                            strokeColor = "#05a095";
                            break;
                        case 3:
                            strokeColor = "#e45522";
                            break;
                        case 4:
                            strokeColor = "#ced520";
                            break;
                        case 5:
                            strokeColor = "#c3c3c3";
                            break;
                    }

                    var pathstring = 'M' + (a.position.x) + ',' + (a.position.y) + ' C' + (a.position.x) + ',' + (a.position.y) + ' ' + (a.position.x) + ',' + (a.position.y) + ' ' + (a.position.x) + ',' + (a.position.y);
                    this.paths[names[i]] = draw.path(pathstring).attr({stroke: strokeColor, 'stroke-width': 2, 'class': 'rel rel'+this.name});
                }
            };
        }

        this.calculateHeight = function(known, liked, hated, loved, unkown) {
            this.position = new Vec2(this.position.x, + w/2 - this.known*known - this.liked*liked - this.hated*hated - this.loved *loved - this.unkown*unkown);
        };

        this.reCalculatePaths = function () {
                for (var i=0; i<names.length; i++) {
                    var a = this;
                    //console.log(this);
                    if (names[i] != this.name) {

                        var startX = Math.floor(this.position.x);
                        var startY = Math.floor(this.position.y);
                        var endX = Math.floor(this.relationships[names[i]].person.position.x);
                        var endY = Math.floor(this.relationships[names[i]].person.position.y);

                    var endOffset = 100;
                    var multiplier  =30;

                        switch(this.relationships[names[i]].rel) {

                            case 1:
                                endOffset += this.relationships[names[i]].person.isKnown*multiplier;
                                endY+=endOffset;
                            break;
                            case 2:
                                endOffset += this.relationships[names[i]].person.isKnown*multiplier;
                                endOffset += this.relationships[names[i]].person.isLiked*multiplier;
                                endY+=endOffset;
                                break;
                            case 3:
                                endOffset += this.relationships[names[i]].person.isKnown*multiplier;
                                endOffset += this.relationships[names[i]].person.isLiked*multiplier;
                                endOffset += this.relationships[names[i]].person.isDisliked*multiplier;
                                endY+=endOffset;
                            break;

                            case 4 :
                                endOffset += this.relationships[names[i]].person.isKnown*multiplier;
                                endOffset += this.relationships[names[i]].person.isLiked*multiplier;
                                endOffset += this.relationships[names[i]].person.isDisliked*multiplier;
                                endOffset += this.relationships[names[i]].person.isLoved*multiplier;
                                endY+=endOffset;
                            break;

                            case 5:
                                endOffset += this.relationships[names[i]].person.isKnown*multiplier;
                                endOffset += this.relationships[names[i]].person.isLiked*multiplier;
                                endOffset += this.relationships[names[i]].person.isDisliked*multiplier;
                                endOffset += this.relationships[names[i]].person.isLoved*multiplier;
                                endOffset += this.relationships[names[i]].person.isUnknown*multiplier;
                                endY+=endOffset;
                            break;
                        }

                    var startOffset = 100;

                        switch(this.relationships[names[i]].rel) {
                            case 1:
                                startOffset += this.knows*multiplier;
                                startY-=startOffset;
                            break;
                            case 2:
                                startOffset += this.knows*multiplier;
                                startOffset += this.likes*multiplier;
                                startY-=startOffset;
                                break;
                            case 3:
                                startOffset += this.knows*multiplier;
                                startOffset += this.likes*multiplier;
                                startOffset += this.dislikes*multiplier;
                                startY-=startOffset;
                            break;

                            case 4 :
                                startOffset += this.knows*multiplier;
                                startOffset += this.likes*multiplier;
                                startOffset += this.dislikes*multiplier;
                                startOffset += this.loves*multiplier;
                                startY-=startOffset;
                            break;

                            case 5:
                                startOffset += this.knows*multiplier;
                                startOffset += this.likes*multiplier;
                                startOffset += this.dislikes*multiplier;
                                startOffset += this.loves*multiplier;
                                startOffset += this.knowsnot*multiplier;
                                startY-=startOffset;
                            break;
                        }

                        var startDirection = 0;
                        var endDirection = 0;

                        if (startX > endX) {
                            startDirection = -100;
                            endDirection = 100;
                        } else {
                            startDirection = 100;
                            endDirection = -100;
                        }

                        var pathstring = 'M' + (startX) + ',' + (startY+25) + ' C' + (startX +startDirection) + ',' + (startY-250) + ' ' + (endX + endDirection) + ',' + (endY+250) + ' ' + (endX) + ',' + (endY);
                        this.paths[names[i]].animate( {path: pathstring, opacity: 1.0}, 50);
                    }
                }
        };


        this.hidePaths = function () {
            for (var i=0; i<names.length; i++) {
                var a = this;
                if (names[i] != this.name) {
                    var startX = Math.floor(this.position.x);
                    var startY = Math.floor(this.position.y);
                    var endX = Math.floor(this.relationships[names[i]].person.position.x);
                    var endY = Math.floor(this.relationships[names[i]].person.position.y);
                    var pathstring = 'M' + (startX) + ',' + (startY) + ' C' + (startX) + ',' + (startY) + ' ' + (endX) + ',' + (endY) + ' ' + (endX) + ',' + (endY);
                    this.paths[names[i]].animate( {path: pathstring, opacity: 0}, 100);
                }
            }
        };

        this.updatePosition = function (x, y) {
            this.position = new Vec2(x, y);
            this.image.animate({ left:this.position.x-this.image.width()/2+'px', top:this.position.y-this.image.height()/2+'px' }, 300);
            this.button.animate( {left:this.position.x-this.button.width()/2+'px', top:this.position.y-this.button.height()/2+'px' }, 300);


        };


        // this functions adds a relationship to a person
        this.addRelationship = function(b, rel)
        {
            if (rel !=0) {
            var temp_relationship = new Relationship(b, rel);
            this.relationships[b.name] = temp_relationship;
            switch(rel) {
                case 1:
                    this.knows++;
                    b.isKnown++;
                    break;
                case 2:
                    this.likes++;
                    b.isLiked++;
                    break;
                case 3:
                    this.dislikes++;
                    b.isDisliked++;
                    break;
                case 4:
                    this.loves++;
                    b.isLoved++;
                    break;
                case 5:
                    this.knowsnot++;
                    b.isUnknown++;
                    break;
            }
            }
        };
    };
});




// vector math needs a good vector class

function Vec2(x, y) {
        this.x = x || 0;
        this.y = y || 0;
}

Vec2.prototype.add = function(v) {
        return new Vec2(this.x + v.x, this.y + v.y);
}

Vec2.prototype.sub = function(v) {
        return new Vec2(this.x - v.x, this.y - v.y);
}

Vec2.prototype.mul = function(v) {
        return new Vec2(this.x * v.x, this.y * v.y);
}

Vec2.prototype.div = function(v) {
        return new Vec2(this.x / v.x, this.y / v.y);
}

Vec2.prototype.scale = function(coef) {
        return new Vec2(this.x*coef, this.y*coef);
}

Vec2.prototype.mutableSet = function(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
}

Vec2.prototype.mutableAdd = function(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
}

Vec2.prototype.mutableSub = function(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
}

Vec2.prototype.mutableMul = function(v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
}

Vec2.prototype.mutableDiv = function(v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
}

Vec2.prototype.mutableScale = function(coef) {
        this.x *= coef;
        this.y *= coef;
        return this;
}

Vec2.prototype.equals = function(v) {
        return this.x == v.x && this.y == v.y;
}

Vec2.prototype.epsilonEquals = function(v, epsilon) {
        return Math.abs(this.x - v.x) <= epsilon && Math.abs(this.y - v.y) <= epsilon;
}

Vec2.prototype.length = function(v) {
        return Math.sqrt(this.x*this.x + this.y*this.y);
}

Vec2.prototype.length2 = function(v) {
        return this.x*this.x + this.y*this.y;
}

Vec2.prototype.dist = function(v) {
        return Math.sqrt(this.dist2(v));
}

Vec2.prototype.dist2 = function(v) {
        var x = v.x - this.x;
        var y = v.y - this.y;
        return x*x + y*y;
}

Vec2.prototype.normal = function() {
        var m = Math.sqrt(this.x*this.x + this.y*this.y);
        return new Vec2(this.x/m, this.y/m);
}

Vec2.prototype.dot = function(v) {
        return this.x*v.x + this.y*v.y;
}

Vec2.prototype.angle = function(v) {
        return Math.atan2(this.x*v.y-this.y*v.x,this.x*v.x+this.y*v.y);
}

Vec2.prototype.angle2 = function(vLeft, vRight) {
        return vLeft.sub(this).angle(vRight.sub(this));
}

Vec2.prototype.rotate = function(origin, theta) {
        var x = this.x - origin.x;
        var y = this.y - origin.y;
        return new Vec2(x*Math.cos(theta) - y*Math.sin(theta) + origin.x, x*Math.sin(theta) + y*Math.cos(theta) + origin.y);
}

Vec2.prototype.toString = function() {
        return "(" + this.x + ", " + this.y + ")";
}