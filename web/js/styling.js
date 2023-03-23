
function node_size(degree) {
    return 10 * degree;
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
MID_GRAY = '#666'

NODE_SELECTED_COLOR = '#fff';
EDGE_SELECTED_COLOR = '#fff';

DEFAULT_CYTOSCAPE_STYLE = [
    {
        'selector': 'node',
        'style': {'background-color': MID_GRAY, 'border-width': 3, 'border-color': 'dark gray', 'text-valign': 'center', 'text-halign': 'center', 'padding': '50%', 'width': 70, 'height': 70, 'text-outline-color': 'black', 'content': 'data(label)', 'font-size': 11}
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
        'style': {'line-color': MUSTARD_YELLOW}
    },
    {
        'selector': '[weight > 50]',
        'style': {'line-color': BURNT_ORANGE}
    },
    {
        'selector': '[weight > 70]',
        'style': {'line-color': MUTED_RED}
    },
]

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
            'style': {'line-color': EDGE_SELECTED_COLOR}
        });
    }

    return DEFAULT_CYTOSCAPE_STYLE.concat(comp_style);
}
