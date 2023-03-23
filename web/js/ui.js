
function on_layout_engine_change(event) {
    change_layout_engine(cy, event.value);
}

function on_energy_threshold_change(event) {
    console.log(event.value);
}

function on_node_select(node) {
    var node_data = node._private.data; // Dont like accessing private members here, but no choice

    selectedNode = node_data;
    selectedEdge = null;

    filter_nodes();
    filter_edges();

    console.log(node_data);
    update_graph_styles();
}

function on_edge_select(edge) {
    var edge_data = edge._private.data; // Dont like accessing private members here, but no choice

    selectedNode = null;
    selectedEdge = edge_data;

    filter_nodes();
    filter_edges();

    console.log(edge_data);
    update_graph_styles();
}

function cb_checked(evt) {
    if ($(evt).prop('checked')) {
        return true;
    }
    else {
        return false;
    }
}

function on_toggle_piston(event) {
    pistonIncluded = cb_checked(event);
    filter_edges();
}

function on_toggle_mtd(event) {
    mtdIncluded = cb_checked(event);
    filter_edges();
}

function on_toggle_gravity(event) {
    gravityIncluded = cb_checked(event);
    filter_edges();
}

function on_toggle_smh(event) {
    smhIncluded = cb_checked(event);
    filter_edges();
}

function on_toggle_smh_g(event) {
    smh_gIncluded = cb_checked(event);
    filter_edges();
}
