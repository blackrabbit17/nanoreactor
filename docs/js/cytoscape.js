function init_cy(nodes, edges) {
    var cyto = window.cy = cytoscape({
        container: document.getElementById('cy'),

        layout: LAYOUT_ENGINES['fcose'],

        style: computed_style(),

        elements: {
            nodes: nodes,
            edges: edges
        }
    });

    return cyto;
}

function update_graph_styles() {
    cy.style(computed_style(selectedNode, selectedEdge));
}

function change_layout_engine(cyto, layout_engine) {
    cy.layout(LAYOUT_ENGINES[currentLayout]).stop();
    cyto.layout(LAYOUT_ENGINES[layout_engine]).run();
    currentLayout = layout_engine;
}

function build_nodes(nodes) {

    const unique_nodes = nodes.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });

    var nodes = [];
    for (var i = 0; i < unique_nodes.length; i++) {
        nodes.push(
            {data :
                {
                    'id': unique_nodes[i],
                    'label': unique_nodes[i]
                }
            }
        );
    }

    return nodes;
}

function build_edges(sources, targets, energy_forward, energy_backward, piston, mtd, gravity, smh, smh_g) {
    var edges = [];
    for (var i = 0; i < sources.length; i++) {
        edges.push(
            {data :
                {
                    'id': sources[i] + '-' + targets[i],
                    'source': sources[i],
                    'target': targets[i],
                    'weight': energy_forward[i],
                    'energy_forward': energy_forward[i],
                    'energy_backward': energy_backward[i],
                    'classes': edge_class_name(piston[i], mtd[i], gravity[i], smh[i], smh_g[i])
                }
            }
        );
    }

    return edges;
}

function filter_nodes() {

}

function dfs_filter_edges(cytoscape_edges, cytoscape_nodes, energy_threshold, rootId) {
    var visited = new Set();
    var energy_filtered = new Set();

    function dfs(node) {
        var connectedEdges = cytoscape_edges.filter(edge => ((edge.data.source == node._private.data.id) || (edge.data.target == node._private.data.id)));
        for (var edge of connectedEdges) {
          if (edge.data.source == node._private.data.id) {
            if(edge.data.energy_forward < energy_threshold) {
                if(!energy_filtered.has(edge)) {
                    energy_filtered.add(edge);
                }
              

                var nextNode = edge.data.target;
                if (!visited.has(nextNode)) {
                    visited.add(nextNode);
                    dfs(cytoscape_nodes.filter(n => n._private.data.id == nextNode)[0]);
                }
            }
          }
          else if (edge.data.target == node._private.data.id) {
            if(edge.data.energy_backward < energy_threshold) {
                if(!energy_filtered.has(edge)) {
                    energy_filtered.add(edge);
                }

                var nextNode = edge.data.source;
                if (!visited.has(nextNode)) {
                    visited.add(nextNode);
                    dfs(cytoscape_nodes.filter(n => n._private.data.id == nextNode)[0]);
                }
            }
          }
    
        }
    }

    var rootNode = cytoscape_nodes.filter(node => node._private.data.id == rootId)[0];
    visited.add(rootNode.data.id);
    dfs(rootNode);

    return Array.from(energy_filtered);
}


function filter_edges() {
    cytoscape_edges = [];

    /* 
        Check which filters are enabled, if the checkbox in the UI is clicked
        (boolean variable pistonIncluded) then add it to 'cytoscape_edges' variable
    */

    for (var i = 0; i < dataset_edges.length; i++) {

        if(pistonIncluded && dataset_edges[i].data.classes.includes('Piston ')) {
            cytoscape_edges.push(dataset_edges[i]);
        }

        if(mtdIncluded && dataset_edges[i].data.classes.includes('MTD ')) {
            cytoscape_edges.push(dataset_edges[i]);
        }

        if(gravityIncluded && dataset_edges[i].data.classes.includes('GRAVITY ')) {
            cytoscape_edges.push(dataset_edges[i]);
        }

        if(smhIncluded && dataset_edges[i].data.classes.includes('SMH ')) {
            cytoscape_edges.push(dataset_edges[i]);
        }

        if(smh_gIncluded && dataset_edges[i].data.classes.includes('SMH_G ')) {
            cytoscape_edges.push(dataset_edges[i]);
        }
    }

    var energy_filtered = dfs_filter_edges(cytoscape_edges, cy.nodes(), energy_threshold, '0');

    cytoscape_edges = energy_filtered;

    cy.edges().remove();
    cy.add(cytoscape_edges);
}
