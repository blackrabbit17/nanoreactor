
function node_size(degree) {
    return 10 * degree;
}

function edge_color(weight) {

    if(!pathway_coloring) {
        return OLIVE_GREEN;
    }

    if(weight > 70) {
        return MUTED_RED;
    }
    else if(weight > 50) {
        return BURNT_ORANGE;
    }
    else if(weight > 30) {
        return MUSTARD_YELLOW;
    }
    else {
        return OLIVE_GREEN;
    }
}

function edge_class_name(piston, mtd, gravity, smh, smh_g) {

    var name = ''

    if(mtd) {
        name += 'MTD ';
    }

    if(gravity) {
        name += 'GRAVITY ';
    }

    if(smh) {
        name += 'SMH ';
    }

    if(smh_g) {
        name += 'SMH_G ';
    }

    if(piston) {
        name += 'Piston '
    }

    return name
}


LAYOUT_ENGINES = 
{
    breadthfirst : {
        name: 'breadthfirst',
        directed: true,
        padding: 10,
        fit: true,
        spacingFactor: 3, // Increase this value to increase the height
    },
    grid : {
        name: 'grid',
    },
    circle : {
        name: 'circle',
    },
    cola: {
        name: 'cola',
        maxSimulationTime: 2000,
        nodeSpacing: 70,
        edgeLength: 150,
        fit: true,
        initialEnergyOnIncremental: 1.0 // Increase initial energy for faster layout
    },
    fcose: {
        name: 'fcose',
        quality: 'proof',
        animate: true,
        animationDuration: 1500,
        fit: true,
        nodeSeparation: 175,

    }
}

MUTED_RED = '#c04040'
BURNT_ORANGE = '#b35d1e'
MUSTARD_YELLOW = '#d8ca4c'
OLIVE_GREEN = '#6b8e23'
MID_GRAY = 'rgb(64,65,77)'

NODE_SELECTED_COLOR = '#fff';
EDGE_SELECTED_COLOR = '#fff';

function default_style() {
    return [
        {
            'selector': 'node',
            'style': {'background-color': MID_GRAY, 'border-width': 2, 'border-color': 'black', 'text-valign': 'center', 'text-halign': 'center', 'padding': '50%', 'width': 70, 'height': 70, 'text-outline-color': 'black', 'content': 'data(label)', 'font-size': 11}
        },

        {
            'selector': 'edge',
            'style': {'line-color': OLIVE_GREEN, 'target-arrow-shape': 'triangle', 'width': 5}
        },
        {
            'selector': '[label = 0]',
            'style': {'background-color': 'blue'}
        },
        {
            'selector': '[[degree >= 0]]',
            'style': {'width': 25, 'height': 25}
        },
        {
            'selector': '[[degree >= 4]]',
            'style': {'width': 35, 'height': 35, 'font-size': 13}
        },
        {
            'selector': '[[degree >= 8]]',
            'style': {'width': 45, 'height': 45, 'font-size': 15}
        },
        {
            'selector': '[[degree >= 12]]',
            'style': {'width': 60, 'height': 60, 'font-size': 17}
        },
        {
            'selector': '[weight > 30]',
            'style': {'line-color': edge_color(30)}
        },
        {
            'selector': '[weight > 50]',
            'style': {'line-color': edge_color(50)}
        },
        {
            'selector': '[weight > 70]',
            'style': {'line-color': edge_color(70)}
        },
    ];
}



function computed_style(selectedNode, selecedEdge) {

    var comp_style = [];

    if(selectedNode) {
        comp_style.push({
            'selector': '[id = "' + selectedNode.id + '"]',
            'style': {'background-color': NODE_SELECTED_COLOR}
        });
    }

    if(selecedEdge) {
        comp_style.push({
            'selector': '[id = "' + selectedEdge.id + '"]',
            'style': {
                'line-color': EDGE_SELECTED_COLOR
            },
        });
    }

    if(proportional_thickness) {

        var max_weight = 0;
        cy.edges().forEach(function(edge) {
            if(edge._private.data.weight > max_weight) {
                max_weight = edge._private.data.weight;
            }
        });

        cy.edges().forEach(function(edge) {
            var weight = edge._private.data.weight;
            var width = 20 * weight / max_weight;

            if (isNaN(width)) {
                width = 0;
            }

            comp_style.push({
                'selector': '[id = "' + edge._private.data.id + '"]',
                'style': {
                    'width': width,
                },
            });
        });
    }

    return default_style().concat(comp_style);
}
