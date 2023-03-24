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

function filter_edges() {
    cytoscape_edges = [];

    if(energy_threshold !== null && energy_threshold !== undefined && energy_threshold > 0) {

    }

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

    var energy_filtered = [];
    for (var i = 0; i < cytoscape_edges.length; i++) {
        if(cytoscape_edges[i].data.energy_forward >= energy_threshold) {
            energy_filtered.push(cytoscape_edges[i]);
        }
    }

    cytoscape_edges = energy_filtered;

    cy.edges().remove();
    cy.add(cytoscape_edges);
}