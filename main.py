import json
import os.path
import re
import urllib.request
from datetime import date, datetime, timedelta

import dash
import dash_bootstrap_components as dbc
import dash_core_components as dcc
import dash_html_components as html
import dash_table
import numpy as np
import pandas as pd
import plotly
import plotly.express as px
import plotly.graph_objects as go
import requests
from bs4 import BeautifulSoup
from flask import Flask, render_template

world_df = None;
app = Flask(__name__)

def prepare_world_data():
	global world_df
	data_date = (date.today() - timedelta(days=1)).strftime('%m-%d-%Y')
	world_df = pd.read_csv(
		'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/{}.csv'.format(
			data_date))
	world_df = world_df[['Country_Region', 'Confirmed', 'Deaths', 'Recovered', 'Active']]
	world_df = world_df.groupby('Country_Region').sum()
	world_df = world_df.reset_index()

def world_heatmap():
	data = dict(type='choropleth',
				locations=world_df['Country_Region'],
				locationmode='country names', z=world_df['Confirmed'],
				text=world_df['Country_Region'], colorbar={'title': 'Corona Cases'},
				colorscale=['#55f262', '#f7cb63', '#f25c49'],
				reversescale=False)

	layout = dict(title='World Corona Cases')

	graphJSON = json.dumps([world_df['Country_Region'],'country names',world_df['Confirmed'],world_df['Country_Region'],['#55f262', '#f7cb63', '#f25c49']], cls=plotly.utils.PlotlyJSONEncoder)
	return graphJSON


@app.route('/')
def index():
	prepare_world_data()
	return render_template('index.html', graphJSON=world_heatmap())


if (__name__ == '__main__'):
	app.run(debug=True)
