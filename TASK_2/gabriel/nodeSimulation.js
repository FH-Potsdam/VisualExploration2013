var update = function() 
{
	verlets.forEach(function(el, i) {
		el.update();
	})

};



window.setInterval(update, 100);



var Verlet = function Verlet(i) {

	this.speed = Math.random()*3;

	this.nodeIndex = i;
	this.position = [Math.random()*document.width, Math.random()*screen.availWidth];
	$("body").append('<p class="node" id="node'+ this.nodeIndex +'">'+  this.nodeIndex +'</p>');
	$("#node" + this.nodeIndex).css( {left: this.position[0] + "px", top: this.position[1] + "px"});


	this.update = function() {
		this.position[1] += this.speed;
		if (this.position[1] > screen.availHeight) {
			this.position[1] = 0;
		}
		$("#node" + this.nodeIndex).css( {left: this.position[0] + "px", top: this.position[1] + "px"});
	}
};


var verlets = new Array();

for (var i = 0; i < 20; i++) {
	verlets[i] = new Verlet(i);
}