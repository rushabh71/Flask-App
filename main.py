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
from flask import Markup
from plotly.offline import plot
import pandas as pd
import plotly
import plotly.express as px
import plotly.graph_objects as go
import requests
from bs4 import BeautifulSoup
from flask import Flask, render_template
from flask import Markup
from flask import session

world_df = None
df_nation = None

daily_confirmed = []
daily_recovered = []
daily_deceased = []
daily_active = []
daily_tested = []

total_confirmed = []
total_recovered = []
total_deceased = []
total_active = []
total_tested = []

dates = []
end_date = None

app = Flask(__name__)

def prepare_world_data():
	global world_df
	data_date = (date.today() - timedelta(days=2)).strftime('%m-%d-%Y')
	world_df = pd.read_csv(
		'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/{}.csv'.format(
			data_date))
	world_df = world_df[['Country_Region', 'Confirmed', 'Deaths', 'Recovered', 'Active']]
	world_df = world_df.groupby('Country_Region').sum()
	world_df = world_df.reset_index()

def world_heatmap():
	prepare_world_data()

	object = {
		'countries' : world_df['Country_Region'],
		'confirmed' : world_df['Confirmed']
	}

	graphJSON = json.dumps(object, cls=plotly.utils.PlotlyJSONEncoder)
	return graphJSON

def toint(x):
	if (x == ''):
		return None
	elif (type(x) == 'str'):
		return int(x)
	else:
		return x


def checkEmptyRate(x):
	if (x == ''):
		return None
	elif (type(x) == 'int'):
		return str(x)
	else:
		return x


def preprocess(x):
	if (type(x) == 'str'):
		return int(x.replace(',', ''))
	return x


def get_numbers():
	global df_nation

	global dates
	global end_date

	global daily_confirmed
	global daily_recovered
	global daily_deceased
	global daily_active
	global daily_tested

	global total_confirmed
	global total_recovered
	global total_deceased
	global total_active
	global total_tested

	URL = 'https://api.covid19india.org/data.json'
	POP = 1352600000 / 1000000

	dates = []

	with urllib.request.urlopen(URL) as url:
		data = json.loads(url.read().decode())

	for d in range(len(data['cases_time_series'])):
		date_string = data['cases_time_series'][d]['date']
		try:
			date = datetime.strptime(date_string, '%d %B ')
		except:
			date = datetime.strptime('29 February 2020 ', '%d %B %Y ')
		date = date.strftime('%d/%m/2020')
		dates.append(date)

	end_date = dates[-1]

	daily_confirmed = [int(i.get('dailyconfirmed', None)) for i in data.get('cases_time_series', None)]
	daily_deceased = [int(i.get('dailydeceased', None)) for i in data.get('cases_time_series', None)]
	daily_recovered = [int(i.get('dailyrecovered', None)) for i in data.get('cases_time_series', None)]

	total_confirmed = [int(i.get('totalconfirmed', None)) for i in data.get('cases_time_series', None)]
	total_deceased = [int(i.get('totaldeceased', None)) for i in data.get('cases_time_series', None)]
	total_recovered = [int(i.get('totalrecovered', None)) for i in data.get('cases_time_series', None)]

	offset = 40

	daily_tested = [0 for i in range(offset)] + [toint(i.get('samplereportedtoday', None)) for i in
												 data.get('tested', None)]
	positivity_rate = [0 for i in range(offset)] + [checkEmptyRate(i.get('testpositivityrate', None)) for i in
													data.get('tested', None)]
	total_tested = [0 for i in range(offset)] + [toint(i.get('totalsamplestested', None)) for i in
												 data.get('tested', None)]

	df_nation = pd.DataFrame()
	df_nation['Daily Confirmed'] = daily_confirmed
	df_nation['Daily Deceased'] = daily_deceased
	df_nation['Daily Recovered'] = daily_recovered
	df_nation['Daily Active'] = df_nation['Daily Confirmed'] - df_nation['Daily Deceased'] - df_nation[
		'Daily Recovered']
	df_nation['Total Confirmed'] = total_confirmed
	df_nation['Total Deceased'] = total_deceased
	df_nation['Total Recovered'] = total_recovered
	df_nation['Total Active'] = df_nation['Total Confirmed'] - df_nation['Total Deceased'] - df_nation[
		'Total Recovered']
	df_nation['Daily Tested'] = daily_tested
	df_nation['Total Tested'] = total_tested
	df_nation['Cases PM'] = np.round(np.array(total_confirmed).astype(float) / POP)
	df_nation['Tests PM'] = np.round(np.array(total_tested).astype(float) / POP)
	df_nation['Positivity Rate'] = positivity_rate
	df_nation.index = dates

	for c in range(0, len(df_nation.columns) - 3):
		df_nation[df_nation.columns.values[c]].map(preprocess)

	df_nation = df_nation.fillna(method='ffill')
	df_nation = df_nation.T

	dates.reverse()
	df_nation = df_nation[dates]

	sign = lambda x: '+' + str(x) if (x >= 0) else str(x)

	object = {'cum_numbers': [total_confirmed[-1],total_recovered[-1],total_deceased[-1],
						  str(int(total_confirmed[-1]) - ( int(total_deceased[-1]) + int(total_recovered[-1]) )),
						  total_tested[-1]],
			  'daily_numbers': ['+'+str(daily_confirmed[-1]),'+'+str(daily_recovered[-1]), '+'+str(daily_deceased[-1]),
						   str(sign(int(daily_confirmed[-1]) - ( int(daily_deceased[-1]) + int(daily_recovered[-1]) ))),
						  '+'+str(daily_tested[-1])] }

	graphJSON = json.dumps(object, cls=plotly.utils.PlotlyJSONEncoder)

	return graphJSON


@app.route('/')
def index():
	global df_nation

	world_heat = world_heatmap()
	numbers = get_numbers()

	dates.reverse()
	df_nation = df_nation[dates]

	npie_labels = ['Confirmed', 'Deceased', 'Recovered', 'Active']
	npie_cases = [df_nation.loc['Total Confirmed', dates[-1]], df_nation.loc['Total Deceased', dates[-1]],
			 df_nation.loc['Total Recovered', dates[-1]], df_nation.loc['Total Active', dates[-1]]]

	return render_template('index.html', world_heat=world_heat, numbers = numbers, world_cols = world_df.columns.values, world_rows = world_df.values.tolist(),
						   nation_cols = df_nation.reset_index().columns.values, nation_rows = df_nation.reset_index().values.tolist(), npie_labels = npie_labels,
						   npie_cases = npie_cases, end_date = end_date
						   )


if (__name__ == '__main__'):
	app.run(debug=True)
