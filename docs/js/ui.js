
function on_toggle_proportional_thickness(event) {
    proportional_thickness = cb_checked(event);
    filter_edges();
    update_graph_styles();
}

function on_toggle_fw_bk(event) {
    show_fw_bk = cb_checked(event);

    rebuild_core_data();

    filter_edges();
    update_graph_styles();
}

function on_toggle_pathway_coloring(event) {
    pathway_coloring = cb_checked(event);
    filter_edges();
    update_graph_styles();
}

function on_layout_engine_change(event) {
    change_layout_engine(cy, event.value);
    update_graph_styles();
}

function on_energy_threshold_change(event) {
    energy_threshold = event.value;
    $('#energy-threshold-label').html(event.value + ' kcal/mol');
    filter_edges();
    update_graph_styles();
}

function on_node_select(node) {
    var node_data = node._private.data; // Dont like accessing private members here, but no choice

    selectedNode = node_data;
    selectedEdge = null;

    filter_nodes();
    filter_edges();

    update_graph_styles();

    hide_sidebars();
    render_node_sidebar();
}

function on_edge_select(edge) {
    var edge_data = edge._private.data; // Dont like accessing private members here, but no choice

    selectedNode = null;
    selectedEdge = edge_data;

    filter_nodes();
    filter_edges();

    update_graph_styles();

    hide_sidebars();
    render_edge_sidebar();
}

function on_deselect() {
    selectedNode = null;
    selectedEdge = null;

    filter_nodes();
    filter_edges();

    update_graph_styles();
    hide_sidebars();
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
    update_graph_styles();
}

function on_toggle_mtd(event) {
    mtdIncluded = cb_checked(event);
    filter_edges();
    update_graph_styles();
}

function on_toggle_gravity(event) {
    gravityIncluded = cb_checked(event);
    filter_edges();
    update_graph_styles();
}

function on_toggle_smh(event) {
    smhIncluded = cb_checked(event);
    filter_edges();
    update_graph_styles();
}

function on_toggle_smh_g(event) {
    smh_gIncluded = cb_checked(event);
    filter_edges();
    update_graph_styles();
}

function hide_sidebars() {
    $('#node-mol-image').attr('src', '');
    $('#edge-src-image').attr('src', '');
    $('#edge-dst-image').attr('src', '');

    $('#node-preview').hide();
    $('#edge-preview').hide();
}

function render_node_sidebar() {
    $('#node-mol-image').attr('src', 'img/' + selectedNode.id + '.png');
    $('#node-preview').show();

    var incoming = get_incoming_edges(selectedNode.id);
    var outgoing = get_outgoing_edges(selectedNode.id);

    // This is just for demo purposes, a templating engine and framework
    // would be better than simple string manipulation

    var html = '<thead><tr><th>Incoming</th><th>Energy (kcal/mol)</th><th class="tag-header">Tags</th></tr></thead>';
    html += '<tbody>';
    for (var i = 0; i < incoming.length; i++) {
        html += '<tr>';
        html += '<td><img class="mol-preview-mini rounded" src="img/' + incoming[i].data.source + '.png" /></td>';
        html += '<td>' +
            '⥤ ' + incoming[i].data.energy_forward + ' <br/><br/>' +
            '⥢ ' + incoming[i].data.energy_backward +
            '</td>';
        html += '<td><small>' + incoming[i].data.classes + '</small></td>';
        html += '</tr>';
    }
    html += '</tbody>';
    $('#mol-incoming').html(html);

    var html = '<thead><tr><th>Outgoing</th><th>Energy (kcal/mol)</th><th class="tag-header">Tags</th></tr></thead>';
    html += '<tbody>';
    for (var i = 0; i < outgoing.length; i++) {
        html += '<tr>';
        html += '<td><img class="mol-preview-mini rounded" src="img/' + outgoing[i].data.target + '.png" /></td>';
        html += '<td>' +
            '⥤ ' + outgoing[i].data.energy_forward + ' <br/><br/>' +
            '⥢ ' + outgoing[i].data.energy_backward +
            '</td>';
        html += '<td><small>' + outgoing[i].data.classes + '</small></td>';
        html += '</tr>';
    }
    html += '</tbody>';
    $('#mol-outgoing').html(html);
}

function render_edge_sidebar() {
    $('#edge-src-image').attr('src', 'img/' + selectedEdge.source + '.png');
    $('#edge-dst-image').attr('src', 'img/' + selectedEdge.target + '.png');

    $('#edge-energy-forward').html(
        '<small>Energy Forward:</small> ' + selectedEdge.energy_forward + ' kcal/mol'
    );

    $('#edge-energy-backward').html(
        '<small>Energy Backward:</small> ' + selectedEdge.energy_backward + ' kcal/mol'
    );

    tags = selectedEdge.classes.split(' ');
    var tag_html = '';
    for (var i = 0; i < tags.length; i++) {
        if (tags[i] != '') {
            tag_html += '<span class="mol-badge new badge blue">' + tags[i] + '</span>';
        }
    };
    $('#edge-tag-container').html(tag_html);
    $('#edge-preview').show();
}
