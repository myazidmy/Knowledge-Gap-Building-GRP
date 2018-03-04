(function() {
  'use strict';

  angular
    .module('kgbStatics')
    .controller('TreeBuilderController', ['backendService','$location','$log','$routeParams','$scope', TreeBuilderController]);

  function TreeBuilderController(backendService,$log,$scope,$routeParams,$location) {
    var that = this;
    that.objectList = {};
    that.synButtonIsClicked = false;
    that.nodeTopicDescription = [];
    var jsonArray =


    {"bmw":[{"European Union":[{"Citizenship of the European Union":[{"Nationalities":[]},{"A level":[{"A-list":[]},{"ASCII":[]}]}]},{"Demographics of Europe":[{"Andrey Korotayev":[{"Andrei Alexandrescu":[]},{"Andrei Arlovski":[{"Andrei Alexandrescu":[]}]}]},{"Digital object identifier":[{"Binary code":[]},{"Boolean algebra":[]}]}]}]},{"1000km Nürburgring":[{"1 E+6 m":[{"1 (number)":[]},{"1 (disambiguation)":[{"1 (number)":[]}]}]},{"1 E+7 m":[]}]}]}

    that.descriptionWithTitle = [{"title":"1000 Blank White Cards","content":"1000 Blank White Cards is a party game played with cards in which the deck is created as part of the game. Though it has been played by adults in organized groups worldwide, 1000 Blank White Cards is also described as well-suited for children in Hoyle's Rules of Games. Since any game rules are contained on the cards (rather than existing as all-encompassing rules or in a rule book), 1000 Blank White Cards can be considered a sort of nomic. It can be played by any number of players and provides the opportunity for card creation and gameplay outside the scope of a single sitting. Creating new cards during the game, dealing with previous cards' effects, is allowed, and rule modification is encouraged as an integral part of gameplay."},{"title":"Game","content":"A game is structured form of play, usually undertaken for enjoyment and sometimes used as an educational tool. Games are distinct from work, which is usually carried out for remuneration, and from art, which is more often an expression of aesthetic or ideological elements. However, the distinction is not clear-cut, and many games are also considered to be work (such as professional players of spectator sports or games) or art (such as jigsaw puzzles or games involving an artistic layout such as Mahjong, solitaire, or some video games).\nKey components of games are goals, rules, challenge, and interaction. Games generally involve mental or physical stimulation, and often both. Many games help develop practical skills, serve as a form of exercise, or otherwise perform an educational, simulational, or psychological role.\nAttested as early as 2600 BC, games are a universal part of human experience and present in all cultures. The Royal Game of Ur, Senet, and Mancala are some of the oldest known games."},{"title":"1000 (number)","content":"1000 or one thousand is the natural number following 999 and preceding 1001. In most English-speaking countries, it is often written with a comma separating the thousands unit: 1,000.\n\nIt may also be described as the short thousand in historical discussion of medieval contexts where it might be confused with the Germanic concept of the \"long thousand\" (1200)."},{"title":"1000 (number)","content":"1000 or one thousand is the natural number following 999 and preceding 1001. In most English-speaking countries, it is often written with a comma separating the thousands unit: 1,000.\n\nIt may also be described as the short thousand in historical discussion of medieval contexts where it might be confused with the Germanic concept of the \"long thousand\" (1200)."}];

    function restyle(obj) {
      Object.keys(obj).forEach(function (k) {
        obj.name = k;
        obj.children = obj[k];
        delete obj[k];
        obj.children.forEach(restyle);
      });
    };

    that.objectList = jsonArray;
    restyle(that.objectList);

    function setNodeTopic(name){
      for(var i =0;i<that.descriptionWithTitle.length;i++){
        if(name.toLowerCase() == that.descriptionWithTitle[i].title.toLowerCase()){
          that.nodeTopicDescription = that.descriptionWithTitle[i].content;
          console.log(that.nodeTopicDescription);
        }else{
          //TODO : error logged
        }
      }
    }

    //function setNodeTopic(name){
    //  for(var i=0;i<that.descriptionWithTitle.length;i++){
    //    that.nodeTopicDescription.push(that.descriptionWithTitle[i]);
    //  }
    //  console.log(that.nodeTopicDescription);
    //}

    $(window).resize(function() {
      that.windowHeight = document.getElementById("tree").offsetHeight;
      that.windowWidth = document.getElementById("tree").offsetWidth;
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /* GRAPH CODE  */  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function buildTree(treeData){

      var contextMenuList = [
        {
          title: 'Remove Node',
          action: function(elm, d, i) {

            if (d.parent && d.parent.children){
              var nodeToDelete = _.where(d.parent.children, {name: d.name});
              if (nodeToDelete){
                d.parent.children = _.without(d.parent.children, nodeToDelete[0]);
              }
              update(d);
            }
          }
        },
        {
          title: 'Synopsis',
          action: function(elm, d, i) {

            console.log("Option 2 clicked");
            console.log("Node Name: "+ d.name);
            setNodeTopic(d.name);
          }
        }
      ];

      var margin = {top:40, right:120,bottom:20,left:20};
      var width = 960 - margin.right - margin.left;
      var height = 900 - margin.top - margin.bottom;

      var w = document.getElementById("tree").offsetWidth;
      var h = document.getElementById("tree").offsetHeight;
      console.log("width "+w+" height "+h);

      var i = 0,duration = 750;
        //refers to the tree itself
      var tree = d3.layout.tree()
        .size([height,width])
        .nodeSize([110,110]);

      var diagonal = d3.svg.diagonal()
        .projection(function(d){
          return [d.x, d.y];
        });

      //refers to the rectangle outside
      var zm;
      var svg = d3.select("#tree").append("svg")
        .attr("width",width+margin.right+margin.left)
        .attr("height",height+margin.top+margin.bottom)
        .append("svg:g")
        .attr("transform","translate("+margin.left+","+margin.top+")")
        .call(zm = d3.behavior.zoom().scaleExtent([0.5,2]).on("zoom", redraw)).append("g")
        .attr("transform","translate("+400+","+50+")");

      zm.translate([400,20]);

      var root = treeData;


      //function autoOpen(head, time) {
      //  window.setTimeout(function() {
      //    nodeclick(head); //do node click
      //    if (head._children) {
      //      //if has children
      //      var timeOut = 1000; //set the timout variable
      //      head._children.forEach(function(child) {
      //        autoOpen(child, timeOut); //open the child recursively
      //        timeOut = timeOut + 1000;
      //      })
      //    }
      //  }, time);
      //}
      //
      //autoOpen(root,1000);

      update(root);

      function update(source){

        var nodes = tree.nodes(root).reverse(),
          links = tree.links(nodes);

        nodes.forEach(function(d){
          d.y = d.depth * 150;
        });

        var node = svg.selectAll("g.node")
          .data(nodes,function(d){
            return d.id || (d.id = ++ i);
          });

        var nodeEnter = node.enter().append("svg:g")
          .attr("class","node")
          .attr("transform",function(d){
            if(!source.x0 && !source.y0)
              return "";
            return "translate("+source.x0 + "," + source.y0 + ")";
          })
          .on("click",nodeClick)
          .on('contextmenu', d3.contextMenu(contextMenuList));

        nodeEnter.append("circle")
          .attr("r",50)
          .attr("stroke",function(d){
            return d.children || d._children ? "steelblue" : "#00c13f";
          })
          .style("fill",function(d){
            return d.children || d._children ? "lightsteelblue" : "#fff";
          })

        nodeEnter.append("text")
          .attr("y",function(d){
            //return d.children || d._children ? -18 : 18;
            return -10;
          })
          .attr("dy",".35em")
          .attr("text-anchor","middle")
          .style("fill-opacity",1e-6)
          .each(function (d) {
            var arr = d.name.split(" ");
            for (i = 0; i < arr.length; i++) {
              d3.select(this).append("tspan")
                .text(arr[i])
                .attr("dy", i ? "1.2em" : 0)
                .attr("x", 0)
                .attr("text-anchor", "middle")
                .attr("class", "tspan" + i);
            }
          });


        //circle for the node mouseover delete functionality
        nodeEnter.append("circle")
          .attr("cx",-35)
          .attr("cy",-48)
          .attr("r",0)
          .attr("class","CircleDel")
          .style("stroke","#aaa")
          .attr("fill","white")
          .style("fill-opacity","1")
          .style("stroke-width","2");

        //circle for the node mouseover synopsis functionality
        nodeEnter.append("circle")
          .attr("cx",35)
          .attr("cy",-48)
          .attr("r",0)
          .attr("class","CircleSyn")
          .style("stroke","#aaa")
          .attr("fill","white")
          .style("fill-opacity","1")
          .style("stroke-width","2");

        //image for the node mouseover delete functionality
        nodeEnter.append("svg:image")
          .attr("class","ImageDel")
          .attr("x",-45)
          .attr("y",-58)
          .attr("width",20)
          .attr("height",20)
          .style("visibility","hidden")
          .style("cursor","pointer")
          .attr("xlink:href","https://cdn2.iconfinder.com/data/icons/social-productivity-line-art-1/128/close-cancel-32.png")
          .on("click",function(d){
            deleteNode(d);
          });

        //image for the node mouseover synopsis functionality
        nodeEnter.append("svg:image")
          .attr("class","ImageSyn")
          .attr("x",25)
          .attr("y",-58)
          .attr("width",20)
          .attr("height",20)
          .style("visibility","hidden")
          .style("cursor","pointer")
          .attr("xlink:href","https://cdn4.iconfinder.com/data/icons/ios7-essence/22/circle_more_detail-24.png")
          .on("mouseover",function(d){
            console.log("image "+ d.name);
            setNodeTopic(d.name);
          });


        var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform",function(d){
            return "translate(" + d.x + "," + d.y + ")";
          });

        nodeUpdate.select("circle")
          .attr("r",50)
          .style("fill",function(d){
            return d._children ? "lightsteelblue" : "#fff";
          });

        nodeUpdate.select("text")
          .style("fill-opacity",1);

        node.on("mouseover",function(d){
          if(d.depth != 0){
            //represents the circle for the move functionality
            d3.select(this).select('.CircleDel')
              .transition()
              .duration(300)
              .attr("r", 10);

            //represents the image for the move functionality
            d3.select(this).select('.ImageDel')
              .transition()
              .duration(300)
              .style("visibility", "visible");
          }

          d3.select(this).select('.ImageSyn')
            .transition()
            .duration(300)
            .style("visibility", "visible");

          d3.select(this).select('.CircleSyn')
            .transition()
            .duration(300)
            .attr("r", 10);
        });

        node.on("mouseout",function(d){

          d3.select(this).select('.CircleDel')
            .transition()
            .duration(300)
            .attr("r", 0)

          d3.select(this).select('.ImageDel')
            .transition()
            .duration(300)
            .style("visibility", "hidden")

          d3.select(this).select('.ImageSyn')
            .transition()
            .duration(300)
            .style("visibility", "hidden")

          d3.select(this).select('.CircleSyn')
            .transition()
            .duration(300)
            .attr("r", 0)
        });

        var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform",function(d){
            return "translate("+ source.x+","+source.y+")";
          })
          .remove();

        nodeExit.select("circle")
          .attr("r",1e-6);

        nodeExit.select("text")
          .style("fill-opacity",1e-6);


        var link = svg.selectAll("path.link")
          .data(links,function(d){
            return d.target.id;
          });

        link.enter().insert("svg:path","g")
          .attr("class","link")
          .attr("d",function(d){
            if(!source.x0 && !source.y0)
              return "";
            var o = {x:source.x0,y:source.y0};
            return diagonal({source:o,target:o});
          });

        link.transition()
          .duration(duration)
          .attr("d",diagonal);

        link.exit().transition()
          .duration(duration)
          .attr("d",function(d){
            var o = {x:source.x,y:source.y};
            return diagonal({source:o,target:o});
          })
          .remove();

        nodes.forEach(function(d){
          d.x0 = d.x;
          d.y0 = d.y;
        });
      }

      function nodeClick(d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      }

      function redraw() {
        svg.attr("transform",
          "translate(" + d3.event.translate + ")"
          + " scale(" + d3.event.scale + ")");
      }

      function deleteNode(d){
        if (d.parent && d.parent.children){
          var nodeToDelete = _.where(d.parent.children, {name: d.name});
          if (nodeToDelete){
            d.parent.children = _.without(d.parent.children, nodeToDelete[0]);
          }
          update(d);
        }
      }
    }

    buildTree(that.objectList);


  };
})();
