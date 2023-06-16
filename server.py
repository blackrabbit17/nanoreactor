# https://cytoscape.org/cytoscape.js-spread/
# https://materializecss.com/icons.html

import os

import pandas as pd
from fastapi import FastAPI, Response
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/css", StaticFiles(directory="docs/css"), name="css")
app.mount("/img", StaticFiles(directory="docs/img"), name="css")
app.mount("/js", StaticFiles(directory="docs/js"), name="css")


@app.get("/")
def root():
    with open(os.path.join("docs", "index.html")) as fh:
        data = fh.read()
    return Response(content=data, media_type="text/html")


@app.get("/reactions/")
def reactions():
    df = pd.read_csv("data/all_tools_graph_final.csv")

    return Response(content=df.to_json(), media_type="application/json")
