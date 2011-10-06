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
    
    options: {
      saveToUrl: false
    },
    
    nodes: [],
    edges: [],
    
    nodeTypes: {},

    init: function() {
      
      var justLoaded = true;
      
      if (Thundersnow.editor) {
        this.editor.init();
      }
      if (Thundersnow.viewer) {
        this.viewer.init();
      }
      this.checkUrlForSave();
      
      window.onpopstate = function(event) {
        if (justLoaded) {
          justLoaded = false;
        }
        else {
          Thundersnow.clearAll();
          if (Thundersnow.options.saveToUrl) {
            Thundersnow.checkUrlForSave()
          }
          else if (event.state) {
            Thundersnow.loadFromJSON(event.state);
          }
          if (Thundersnow.editor) {
            Thundersnow.editor.redraw();
          }
        }

      };
      
    },
    
    checkUrlForSave: function() {
      var base64 = gup('s');
      if (base64) {
        var json = atob(base64);
        this.loadFromJSON(json);
        return true;
      }
      return false;
      
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
    
    serializeToJSON: function() {
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
      return JSON.stringify(output);
    },
    
    onChange: function() {
      if (this.options.saveToUrl) {
        this.saveToUrl();
      }
      else {
        this.pushToHistory();
      }
    },
    
    pushToHistory: function() {
      window.history.pushState(this.serializeToJSON(), "Saved", window.location.href);
    },
    
    saveToUrl: function() {
      
      // if (!confirm("Depending on the file size, this may take some time. Do you wish to continue?")) {
      //   return;
      // }
      
      this.convertToBase64(this.serializeToJSON(), function(data) {
        var base64 = data;
        var url_root = window.location.href.split("?")[0];
        var url_base64 = gup('s');
        if (url_base64 != base64) {
          window.history.pushState("object", "Saved", url_root + "?s=" + base64);
        }
      });
      
    },
    
    convertToBase64: function(data, callback) {
      if (window.Worker) {
        var btoa_worker = new Worker('btoa_worker.js');
        btoa_worker.onmessage = function(e){
          callback(e.data);
        }
        btoa_worker.postMessage(data);
      }
      else {
        callback(btoa(data));
      }
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
    
    clearAll: function() {
      for (var n in this.nodes) {
        var node = this.nodes[n];
        delete node;
      }
      for (var e in this.edges) {
        var edge = this.edges[n];
        delete edge;
      }
      this.nodes = [];
      this.edges = [];
      if (Thundersnow.editor) {
        Thundersnow.editor.nodes = Thundersnow.nodes;
        Thundersnow.editor.edges = Thundersnow.edges;
      }
      if (Thundersnow.viewer) {
        Thundersnow.viewer.nodes = Thundersnow.nodes;
        Thundersnow.viewer.edges = Thundersnow.edges;
      }
    },
    
    testLoad: function() {
      var save = "{\"nodes\":[{\"x\":10,\"y\":220,\"nodeType\":\"lfo\",\"name\":null,\"uuid\":\"0.24939937610179186\",\"inputAttributes\":{\"period\":0.5,\"amplitude\":50,\"offset\":50}},{\"x\":10,\"y\":10,\"nodeType\":\"lfo\",\"name\":null,\"uuid\":\"0.6434503174386919\",\"inputAttributes\":{\"period\":0.5,\"amplitude\":73.4658675300188,\"offset\":50}},{\"x\":340,\"y\":10,\"nodeType\":\"sprite\",\"name\":null,\"uuid\":\"0.5609620048198849\",\"inputAttributes\":{\"x\":83.08823186070919,\"y\":0,\"width\":10,\"height\":10,\"color\":\"#FFF\",\"image\":null}},{\"x\":340,\"y\":190,\"nodeType\":\"sprite\",\"name\":null,\"uuid\":\"0.32594600692391396\",\"inputAttributes\":{\"x\":0,\"y\":83.08823186070919,\"width\":\"100\",\"height\":73.4658675300188,\"color\":\"#FFF\",\"image\":null}}],\"edges\":[{\"output_node_uuid\":\"0.6434503174386919\",\"output_attribute\":\"output\",\"input_node_uuid\":\"0.5609620048198849\",\"input_attribute\":\"x\"},{\"output_node_uuid\":\"0.6434503174386919\",\"output_attribute\":\"output\",\"input_node_uuid\":\"0.32594600692391396\",\"input_attribute\":\"y\"},{\"output_node_uuid\":\"0.24939937610179186\",\"output_attribute\":\"output\",\"input_node_uuid\":\"0.6434503174386919\",\"input_attribute\":\"amplitude\"},{\"output_node_uuid\":\"0.24939937610179186\",\"output_attribute\":\"output\",\"input_node_uuid\":\"0.32594600692391396\",\"input_attribute\":\"height\"}]}"
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
    //Thundersnow.testLoad();
    //Thundersnow.test();
  }
  
//})();