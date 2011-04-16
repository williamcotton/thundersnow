Thundersnow
===========

Command+Enter triggers the "add new node window". Right now, the choices are: lfo, sprite, and rgb_color

Hit 'd' to delete a node.

Oh, don't fork this just yet as I'm probably going to be making some significant architectural changes... the bigs ones being adding multiple "editor contexts" and "view contexts", allowing for macro nodes, interators, render in image, etc.

TODO
----
* Make it based on -1 to 1, with the origin in the center, instead of the origin being in the top left and based on pixels, so that things can be resized.
* Copy and Paste
* Add viewer window transport controls
* Add render layers
* Add ability to save and load node inputAttributes
* Add imageref support
* Ability to select and delete edges

DISTANT TODO
------------
* mouse over for "tooltip", to show what's going on at the IO
* Render In Image
* Iteration
* Macros
* GUI elements directly on nodes
* Add External Time patch support
* Add evented outputs to the existing continuous outputs (ala MaxMSP... evented outputs would respond to things like "bangs")
* Ability to move edges, ala MaxMSP
* editor window scrolling
* external dependencies ("require: 'http://someserver.com/somefile.ts.js'")

FARTHER
-------
* Centralized Thundersnow nodeType repository

WAYOFF
------
* Add WebGL support
* Make an OSC to Websocket bridge
* PageRank applied to the nodes and edges?