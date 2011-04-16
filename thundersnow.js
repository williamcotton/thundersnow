/*

Thundersnow v0.0.1
==================
==================

Copyright 2011, William Cotton
All Rights Reserved (for now)

Date: 4/10/2011

*/

//(function() {

  Thundersnow = {
    
    nodes: [],
    edges: [],
    
    nodeTypes: {},

    init: function() {
      if (Thundersnow.editor) {
        this.editor.init();
      }
      if (Thundersnow.viewer) {
        this.viewer.init();
      }
    },
    
    loadFromJSON: function(json) {
      var parsed_json = JSON.parse(json);
      
      for (var n in parsed_json.nodes) {
        var node = parsed_json.nodes[n];
        new Thundersnow.Node(node);
      }
      for (var e in parsed_json.edges) {
        var edge = parsed_json.edges[e];
        edge.input_node = this.findNodeByUUID(edge.input_node_uuid);
        edge.output_node = this.findNodeByUUID(edge.output_node_uuid);
        new Thundersnow.Edge(edge);
      }
    },
    
    serializeToJSON: function(nodes, edges) {
      var nodes = [];
      for (var n in this.nodes) {
        var node = this.nodes[n];
        nodes.push(node.toJSON());
      }
      var edges = [];
      for (var e in this.edges) {
        var edge = this.edges[e];
        edges.push(edge.toJSON());
      }
      var output = {
        nodes: nodes,
        edges: edges
      }
      console.log(output);
      return JSON.stringify(output);
    },
    
    findNodeByUUID: function(node_uuid) {
      for (var n in this.nodes) {
        var node = this.nodes[n];
        if (node.uuid == node_uuid) {
          return node;
        }
      }
    },

    generateUUID: function() {
      return Math.random(0).toString(); // WAZZZZZZUPPP!!!
    },
    
    testLoad: function() {
      var save = "{\"nodes\":[{\"x\":10,\"y\":220,\"nodeType\":\"lfo\",\"uuid\":\"0.24939937610179186\"},{\"x\":10,\"y\":10,\"nodeType\":\"lfo\",\"uuid\":\"0.6434503174386919\"},{\"x\":340,\"y\":10,\"nodeType\":\"sprite\",\"uuid\":\"0.5609620048198849\"},{\"x\":340,\"y\":190,\"nodeType\":\"sprite\",\"uuid\":\"0.32594600692391396\"}],\"edges\":[{\"output_node_uuid\":\"0.6434503174386919\",\"output_attribute\":\"output\",\"input_node_uuid\":\"0.5609620048198849\",\"input_attribute\":\"x\"},{\"output_node_uuid\":\"0.6434503174386919\",\"output_attribute\":\"output\",\"input_node_uuid\":\"0.32594600692391396\",\"input_attribute\":\"y\"},{\"output_node_uuid\":\"0.24939937610179186\",\"output_attribute\":\"output\",\"input_node_uuid\":\"0.6434503174386919\",\"input_attribute\":\"amplitude\"}]}";
      this.loadFromJSON(save);
    },
    
    test: function() {
      
      sprite_1 = new Thundersnow.Node({
        x: 340,
        y: 10,
        nodeType: "sprite"
      });
      
      sprite_2 = new Thundersnow.Node({
        x: 340,
        y: 190,
        nodeType: "sprite"
      });
      
      lfo_1 = new Thundersnow.Node({
        x: 10,
        y: 10,
        nodeType: "lfo"
      });
      
      lfo_2 = new Thundersnow.Node({
        x: 10,
        y: 220,
        nodeType: "lfo"
      });
      
      lfo_1_sprite_1 = new Thundersnow.Edge({
        output_node: lfo_1,
        output_attribute: "output",
        input_node: sprite_1,
        input_attribute: "x"
      });
      
      lfo_1_sprite_2 = new Thundersnow.Edge({
        output_node: lfo_1,
        output_attribute: "output",
        input_node: sprite_2,
        input_attribute: "y"
      });
      
      lfo_2_lfo_1 = new Thundersnow.Edge({
        output_node: lfo_2,
        output_attribute: "output",
        input_node: lfo_1,
        input_attribute: "amplitude"
      });
      
    }

  }
  
  /*
  
  Initializer
  -----------
  
  */
  
  window.onload = function() {
    Thundersnow.init();
    Thundersnow.testLoad();
    //Thundersnow.test();
  }
  
//})();