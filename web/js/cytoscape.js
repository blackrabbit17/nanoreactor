function init_cy(nodes, edges) {
    var cyto = window.cy = cytoscape({
        container: document.getElementById('cy'),

        layout: LAYOUT_ENGINES['fcose'],

        style: DEFAULT_CYTOSCAPE_STYLE,

        elements: {
            nodes: nodes,
            edges: edges
        }
    });

    return cyto;
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

function build_edges(sources, targets, weights, piston, mtd, gravity, smh, smh_g) {
    var edges = [];
    for (var i = 0; i < sources.length; i++) {
        edges.push(
            {data :
                {
                    'id': sources[i] + '-' + targets[i],
                    'source': sources[i],
                    'target': targets[i],
                    'weight': weights[i],
                    'classes': edge_class_name(piston, mtd, gravity, smh, smh_g)
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

    cy.edges().remove();
    cy.add(cytoscape_edges);
}