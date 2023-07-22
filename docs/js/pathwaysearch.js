
var ps_source_select_active = false;
var ps_source = null;

var ps_dest_select_active = false;
var ps_dest = null;

function reset_pathway_search() {
    ps_source_select_active = false;
    ps_source = null;

    ps_dest_select_active = false;
    ps_dest = null;

    $('#ps_source').hide();
    $('#ps_destination').hide();
    $('#ps_btn').html('PATHWAY SEARCH');
    $('#ps_source_mol_img').hide();
    $('#ps_destination_mol_img').hide();

    rebuild_core_data();
    filter_edges();
}

function start_pathway_search() {

    if(ps_source_select_active || ps_dest_select_active) {
        reset_pathway_search();
        return;
    }

    if(ps_source != null && ps_dest != null) {
        reset_pathway_search();
        return;
    }

    ps_source_select_active = true;

    $('#ps_source_busy').show();

    $('#ps_btn').html('CANCEL');
    $('#ps_source').show();
    $('#ps_source_header').html('Select source molecule');
}

function did_select_source(node_data) {
    ps_source_select_active = false;
    ps_source = node_data;

    $('#ps_source_busy').hide();
    $('#ps_source_header').html('Source Molecule');

    ps_dest_select_active = true;
    $('#ps_destination').show();
    $('#ps_destination_header').html('Select destination molecule');
    $('#ps_destination_busy').show();

    $('#ps_source_mol_img').attr('src', 'img/' + node_data.id + '.png');
    $('#ps_source_mol_img').show();
}

function did_select_dest(node_data) {
    ps_dest_select_active = false;
    ps_dest = node_data;

    $('#ps_destination_busy').hide();
    $('#ps_destination_header').html('Destination Molecule');

    $('#ps_btn').html('RESET');
    $('#ps_destination_mol_img').attr('src', 'img/' + node_data.id + '.png');
    $('#ps_destination_mol_img').show();

    //cy.edges().remove();
}