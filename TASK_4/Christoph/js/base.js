jQuery(document).ready(function($) {
	$.ajax({
		dataType: "json",
		type: "post",
		async: false,
		url: "twitter/",
		data: { 
      request: {
  			host: "api.twitter.com",
  			url: "/1.1/search/tweets.json",
  			parameters:  {
  				q: "#ui",
  				count: 100
			  }
      }
     },
		success: function(data, status) {
      $.each( data.response.statuses, function( index, item ) {
        tweet_explorer.creat_tweet({
          index: index,
          id: item.id,
          name: item.user.name,
          date: item.created_at,
          content: item.text,
          tags: item.entities.hashtags
        });
      });
      tweet_explorer.data = data.response.statuses;
    
      $( ".tweet" ).draggable({
        cancel: "a.ui-icon", // clicking an icon won't initiate dragging
        revert: "invalid", // when not dropped, the item will revert back to its initial position
        containment: "document",
        zIndex: 100,
        cursor: "move"
      });
    
      $("#compare").droppable({
        accept: "#container .tweet, #trash .tweet",
        hoverClass: "active",
        drop: function( event, ui ) {
          tweet_explorer.add_tweet( ui.draggable, "#compare" );
        }
      });
      
      $("#trash-droppzone, #trash").droppable({
        accept: "#container .tweet, #compare .tweet",
        hoverClass: "active",
        tolerance: "touch",
        drop: function( event, ui ) {
          tweet_explorer.add_tweet( ui.draggable, "#trash" );
        }
      });
    
      $("#container").droppable({
        accept: "#trash .tweet, #compare .tweet",
        hoverClass: "active",
        drop: function( event, ui ) {
          tweet_explorer.add_tweet( ui.draggable, "#container" );
        }
      });
      
      $("#compare").sortable();
      
      $(".filter").on("click", tweet_explorer.filter);
      $("#trash-label").on("click", function () { 
        tweet_explorer.slide("#trash-container");
      });
      tweet_explorer.initiate();
      
      $(".help-message, .help-message .close").on("click", function() {
        tweet_explorer.write_cookie("show_help_message", "false")
        tweet_explorer.help_message("false");
      })
		}
	});
});


var tweet_explorer = {
  data: null,
  cookie_elements: [],
  marked_tags: [],
  compare_limit: 4,
  trash: false,
  
  initiate: function() {
    //this.clean_cookie();
    this.help_message();
    this.limit_droppable();
  },
  
  creat_tweet: function(props) {
    props.date = this.relative_time(this.parse_date(props.date));
    self = this;
    tweet_template = $("#tweet-template").html();
    tweet = tweet_template.replace(/{([^}]*)}/g, function(match, val) { 
      return typeof props[val] != 'undefined'
        ? (typeof props[val] == 'object' 
          ? self.clean_tags(props[val])
          : props[val])
        : match
      ;
    });

    
    is_compare = _.find(this.read_cookie("#compare"), function(item) { return item == props.id});
    is_trash = _.find(this.read_cookie("#trash"), function(item) { return item == props.id});
    
    if(is_compare) {
      return $(tweet).appendTo("#compare");
    } else if(is_trash) {
      return $(tweet).appendTo("#trash");
    } else {
      return $(tweet).appendTo("#container");
    }
  },
  
  clean_tags: function(tags) {
    tag_string = "";
    $.each(tags, function(index, item) {
      tag_string += '<div class="filter"></div><div class="tweet-tag">'+item.text+'</div>';
    });
    return tag_string
  },
  
  add_tweet: function(item, target) {
    id = $(item).attr("id").substring(3);
    parent = "#"+$(item).parent().attr("id");
    console.log(parent);
    if(target == "#compare") {
      this.write_cookie("#compare",id, parent);
    }
    if(target == "#trash") {
      this.write_cookie("#trash",id, parent);
    }
    if(target == "#container") {
      this.write_cookie("#container",id, parent);
    }
       
    $(item).appendTo(target).css({top: "", left: ""});
    tweet_explorer.limit_droppable();
  },
  
  filter: function(element) {
    self = tweet_explorer;
    
    //change button to active
    $(this).toggleClass("active");
    
    //tag from the clickt element
    curr_tag = $(this).next(".tweet-tag").html();
    
    //check if the current tag is in the array
    position_tag = _.indexOf(self.marked_tags, curr_tag);
    position_tag != -1 ? self.marked_tags.splice(position_tag, 1) : self.marked_tags.push(curr_tag);
    
    //search for all tags from the marked list
    items = _.filter(tweet_explorer.data, function(item) { return _.some(item.entities.hashtags, function(tag) { if(_.contains(self.marked_tags, tag.text) == true) { return tag;} }) });
    
    $("#container .tweet").css({"background": "rgba(220,220,220,1)"})
    //change background of all tweets with a tag from the marked list
    color = [];
    $.each(items, function(index, item) {
      if (color[item.id] === undefined) color[item.id] = 0;
      color[item.id] += 0.1;
      $("#container #id-"+item.id).css({"background": "rgba(255,0,0,"+color[item.id]+")"});
    })
  },
  
  limit_droppable: function() {
    //disable dopping if 4 items are in the sidebar
    compare_max = $("#compare .tweet").length;
    if(compare_max == 0) {
      $("#compare .message").show();
    } else {
      $("#compare .message").hide();
    }
    if (compare_max >= this.compare_limit) {
      $("#compare").droppable("disable");
    } else {
      $("#compare").droppable("enable");
    }
  },
  
  read_cookie: function(key, string) {
    var return_value;
    cookies = document.cookie.replace(" ", "").split(';');
    if(cookies[0]) {
      for(i = 0; i < cookies.length; i++) {
        cookie = cookies[i].split("=");
        cookie_key = cookie[0].replace(/ /g, "");
        cookie_value = cookie[1].split(",");
        this.cookie_elements[cookie_key] = cookie_value;
        if(key == cookie_key && string == true) {
          return_value = cookie[1];
        } else if(key == cookie_key){
          return_value = cookie_value;
        }
      }
      return return_value;
    }
  },
  
  write_cookie: function(key, value, parent) {
    console.log(parent);
    if(this.read_cookie("show_help_message") && key == "show_help_message") {
      return
    }
    filtered = _.filter(this.cookie_elements[parent], function(item) { return item != value });
    console.log(filtered);
    if(!this.cookie_elements[parent]) this.cookie_elements[parent] = [];
    this.cookie_elements[parent] = filtered;
    
    if(!this.cookie_elements[key]) this.cookie_elements[key] = [];
    this.cookie_elements[key].push(value);
    this.cookie_elements[parent].length != 0 ? document.cookie = parent+"="+this.cookie_elements[parent]+";" : document.cookie = parent+"=0;";
    this.cookie_elements[key].length != 0 ? document.cookie = key+"="+this.cookie_elements[key]+";"  : document.cookie = key+"=0;";
    console.log(document.cookie);
  },
  
  help_message: function() {
    compare_items = $("#compare .tweet").length;
    trash_items = $("#trash .tweet").length;
    this.read_cookie("show_help_message", true) == "false" ? message = false : message = true;
    if(compare_items == 0 && trash_items == 0 && message == true) {
      $(".help-message").hide();
      //$(".help-message").show();
    } else {
      $(".help-message").hide();
    }
  },
  clean_cookie: function() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    console.log(document.cookie);
  },
  
  parse_date: function(date_str) {
    return Date.parse(date_str.replace(/^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i, '$1,$2$4$3'));
  },
  relative_time: function(date) {
    var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
    var delta = parseInt((relative_to.getTime() - date) / 1000, 10);
    var r = '';
    if (delta < 1) {
      r = 'just now';
    } else if (delta < 60) {
      r = delta + ' seconds ago';
    } else if(delta < 120) {
      r = 'about a minute ago';
    } else if(delta < (45*60)) {
      r = 'about ' + (parseInt(delta / 60, 10)).toString() + ' minutes ago';
    } else if(delta < (2*60*60)) {
      r = 'about an hour ago';
    } else if(delta < (24*60*60)) {
      r = 'about ' + (parseInt(delta / 3600, 10)).toString() + ' hours ago';
    } else if(delta < (48*60*60)) {
      r = 'about a day ago';
    } else {
      r = 'about ' + (parseInt(delta / 86400, 10)).toString() + ' days ago';
    }
    return r;
  },
  
  slide: function(target) {
    if(this.trash == true) {
      $(target).animate({"left" : -270});
      $("#container").animate({"left" : 0});
      this.trash = false;
    } else {
      $(target).animate({"left" : 0});
      $("#container").animate({"left" : 270});
      this.trash = true;
    }
  }
}

