#
# Original Reference Implementation
#

import dash
import dash_cytoscape as cyto
import dash_core_components as dcc
import dash_html_components as html
#from dash import dcc
#from dash import html
from dash.dependencies import Input, Output, State
import numpy as np
import sys
import base64

import flask
import glob
import os

image_directory = '/Users/alexchang/Documents/Martinez/phenylO2_tools/images6/'
list_of_images = [os.path.basename(x) for x in glob.glob('{}*.png'.format(image_directory))]
static_image_route = '/static/'

encoded_images = {}
for image_filename in list_of_images:
    #open(image_directory + image_filename)
    encoded_image = base64.b64encode(open(image_directory + image_filename, 'rb').read())
    #encoded_images.append(encoded_images[int(image_filename)]: encoded_image)
    encoded_images[str(int(image_filename[:-4]))] = encoded_image

external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']
dashapp = dash.Dash(__name__, external_stylesheets=external_stylesheets)

#rfile = 'phenylO2_graph.csv'
with open(sys.argv[1], 'r') as f:
    rfile = np.loadtxt(f, skiprows= 1, delimiter = ',')
rcopy = rfile
toollist = ['Piston', 'MTD', 'Gravity', 'SMH', 'SMH-g']

def create_elements(rfile):
    nodes = [{'data': {'id': number, 'label': number}} for number in np.unique(np.ndarray.flatten(rfile[:, 0:2]))]
    edges = [{'data': {'source': int(source), 'target': int(target), 'weight': weight}, 'classes': create_className(m, s, p)} for source, target, weight, m, s, p in rfile[:, 0:6]]
    elements = nodes + edges
    return elements

def node_size(deg):
    size = 5 + 5 * deg
    return size

def accessible(rfile):
    access_dict = {}
    for node in range(int(max(np.ndarray.flatten(rfile[:, 0:2])) + 1)):
        node_Ein = []
        for row in rfile:
            if node == int(row[0]):
                node_Ein.append(row[3])
            elif node == int(row[1]):
                node_Ein.append(row[2])
        access_dict[str(node)] = node_Ein
    return access_dict

def update_array(rfile, tool, value):
    found_init = False
    init = 0
    while not found_init:
        init_tools = rfile[init][4:]
        forces = [toollist[i] for i in range(len(init_tools)) if init_tools[i] == 1]
        if not any(item in forces for item in tool):
            init += 1
        else:
            accessible = [int(rfile[init][0])]
            queue = [int(rfile[init][0])]
            found_init = True
    newfile = []
    while queue:
        s = queue.pop(0)
        for reac in rfile:
            tools = reac[4:]
            forces = [toollist[i] for i in range(len(tools)) if tools[i] == 1]
            if not any(item in forces for item in tool):
                continue
            if s == reac[0]: #s is the reactant
                if reac[2] < value:
                    if reac[1] not in accessible:
                        accessible.append(reac[1])
                        queue.append(reac[1])
                    newfile.append(reac)
            elif s == reac[1]:  #s is the product
                if reac[3] < value:
                    if reac[0] not in accessible:
                        accessible.append(reac[0])
                        queue.append(reac[0])
                    newfile.append(reac)

    return np.array(newfile)

def create_className(m, s, p):
    cname = ''
    if m == 1:
        cname += 'MTD '
    if s == 1:
        cname += 'SMH '
    if p == 1:
        cname += 'Piston'
    return cname
defaultstyle=[
    {
        'selector': 'node',
        'style': {'background-color': 'white', 'border-width': 3, 'border-color': 'dark gray', 'text-valign': 'center', 'text-halign': 'center', 'padding': '50%', 'width': 70, 'height': 70, 'text-outline-color': 'black', 'content': 'data(label)', 'font-size': 11}

    },

    {
        'selector': 'edge',
        'style': {'line-color': 'green', 'target-arrow-shape': 'triangle', 'width': 5}
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
        'style': {'line-color': 'yellow'}
    },

    {
        'selector': '[weight > 50]',
        'style': {'line-color': 'orange'}
    },

    {
        'selector': '[weight > 70]',
        'style': {'line-color': 'red'}
    },

]

elements_all = create_elements(rfile)
elements=elements_all
dashapp.layout = html.Div([

        dcc.Slider(
            id = 'my-slider',
            min = 0,
            max = 200,
            step = 1,
            value = 100,
            marks = {0: '0 kcal/mol', 25: '25', 50: '50', 75: '75', 100: '100', 125: '125', 150: '150', 175: '175', 200: '200'}),
        html.Div(id='slider-output-container'), 

        html.Div(
        dcc.Checklist(id = 'my-checklist',
            options=[
                {'label': 'Gravity', 'value': 'Gravity'},
                {'label': 'MTD', 'value': 'MTD'},
                {'label': 'SMH', 'value': 'SMH'},
                {'label': 'SMH-g', 'value': 'SMH-g'},
                {'label': 'Piston', 'value': 'Piston'}
            ],
            value = ['Piston', 'Gravity', 'MTD', 'SMH', 'SMH-g']
            ), style = {'width': '49%','display': 'inline-block'}),
        html.Div(
            html.Img(id='cytoscape-mouseoverNodeData-output', draggable = 'yes', sizes = '100px', height = '100'),
            style = {'width': '49%', 'display': 'inline-block', 'align-items': 'center', 'justify-content': 'center'}),
    cyto.Cytoscape(
        id = 'phenylO2',
        elements = elements,
        layout = {'name': 'cose'},
        
        style={'width': '100%', 'height': '600px', 'background-color': 'black'},
        stylesheet=defaultstyle

        

    ),
])

@dashapp.callback(
    Output('phenylO2', 'elements'),
    Input('my-slider', 'value'),
    Input('my-checklist', 'value'),
    State('phenylO2', 'elements'))
    #State('phenylO2', 'style'))
def update_elements(value, tool, elements):
    new_elements = []
    dic = accessible(rfile)
    if tool:
        newfile = update_array(rfile, tool, value)
        elements = create_elements(newfile)
    else:
        elements = [{'data': {'id': '0', 'label': 0}}]
    return elements

@dashapp.callback(
    Output('cytoscape-mouseoverNodeData-output', 'src'),
    Input('phenylO2', 'mouseoverNodeData'))
    #State('phenylO2', 'style'))
def displayTapNodeData(data):
    if data:
        try:
            src = 'data:image/png;base64,{}'.format(encoded_images[str(int(data['label']))].decode())
        except:
            src = None
        return src
        #return static_image_route + str(data['label'])
@dashapp.server.route('{}<image_path>.png'.format(static_image_route))
def serve_image(image_path):
    image_name = '{}.png'.format(image_path)
    if image_name not in list_of_images:
        raise Exception('"{}" is excluded from the allowed static files'.format(image_path))
    return flask.send_from_directory(image_directory, image_name)
if __name__ == '__main__':
    dashapp.run_server(debug=True)
