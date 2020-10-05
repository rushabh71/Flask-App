import json
import re
import urllib.request
from datetime import date, datetime, timedelta
import numpy as np
import pandas as pd
import plotly
import requests
from bs4 import BeautifulSoup
from flask import Flask, render_template, request, jsonify
from numpy import inf

world_df = None
df_nation = None
df_state = None
df_district = None
state_names = None

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

countries = []
dates = []
end_date = None

app = Flask(__name__)

def prepare_world_timeseries():

	global countries
	object = dict()

	world_df_time_c = pd.read_csv(
		'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
		error_bad_lines=False)
	world_df_time_c = world_df_time_c.groupby('Country/Region').sum()
	world_df_time_c = world_df_time_c.reset_index()
	world_dates = pd.to_datetime(world_df_time_c.columns[3:]).strftime('%d/%m/%Y').tolist()

	world_df_time_d = pd.read_csv(
		'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv',
		error_bad_lines=False)
	world_df_time_d = world_df_time_d.groupby('Country/Region').sum()
	world_df_time_d = world_df_time_d.reset_index()

	world_df_time_r = pd.read_csv(
		'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv',
		error_bad_lines=False)
	world_df_time_r = world_df_time_r.groupby('Country/Region').sum()
	world_df_time_r = world_df_time_r.reset_index()

	for c in countries:
		world_confirmed = world_df_time_c[world_df_time_c['Country/Region'] == c].values[0][3:].tolist()
		world_deceased = world_df_time_d[world_df_time_d['Country/Region'] == c].values[0][3:].tolist()
		world_recovered = world_df_time_r[world_df_time_r['Country/Region'] == c].values[0][3:].tolist()

		world_mortality = []

		for i,j in zip(world_deceased, world_confirmed):
			if(j!=0):
				world_mortality.append(i/j)
			else:
				world_mortality.append(0)


		object[c] = {'Confirmed' : world_confirmed,
					 'Deceased' : world_deceased,
					 'Recovered' : world_recovered,
					 'Mortality' : world_mortality}

	object['Dates'] = world_dates

	return json.dumps(object, cls=plotly.utils.PlotlyJSONEncoder)


def prepare_world_data():
	global world_df
	global countries

	data_date = (date.today() - timedelta(days=2)).strftime('%m-%d-%Y')
	world_df = pd.read_csv(
		'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/{}.csv'.format(
			data_date))
	world_df = world_df[['Country_Region', 'Confirmed', 'Deaths', 'Recovered', 'Active']]
	world_df = world_df.groupby('Country_Region').sum()
	world_df = world_df.reset_index()
	world_df = world_df.sort_values(by='Confirmed', ascending=False)

	countries = world_df['Country_Region'].values[0:10].tolist()

def world_heatmap():
	prepare_world_data()

	object = {
		'countries' : world_df['Country_Region'],
		'Confirmed' : world_df['Confirmed'],
		'Deceased': world_df['Deaths'],
		'Recovered': world_df['Recovered'],
		'Active': world_df['Active']
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


def getStateName(code):
	state = {'CT': 'Chhattisgarh',
             'TG' : 'Telangana',
             'TN' : 'Tamil Nadu',
             'LA' : 'Ladakh',
             'DN' : 'Dadra and Nagar Haveli',
             'UT' : 'Uttarakhand',
             'TT' : 'Total' }
	return state.get(code, None)


def prepare_state_data():

	global df_state
	global state_names

	try:
		fh = open('data.json', 'r')
		if (len(fh.read()) > 0):
			state_names = json.loads(fh.read())
	except:
		URL = 'https://api.covid19india.org/v4/data.json'
		URL_STATE_ABR = 'https://slusi.dacnet.nic.in/watershedatlas/list_of_state_abbreviation.htm'

		with urllib.request.urlopen(URL) as url:
			data = json.loads(url.read().decode())

		code_page = requests.get(URL_STATE_ABR)
		soup = BeautifulSoup(code_page.content, 'html.parser')

		keys = []
		values = []
		raw_list = []

		page_code = soup.find_all('span')

		for i in page_code:
			raw_list.append(re.findall('.*HI.>([A-Z].*)<o:p></o:p>.*', i.decode()))

		headers = ['Sl. No.', 'State/ UT', 'Abbreviation']

		for d in raw_list:
			if (len(d) > 0 and d[0] not in headers):
				if (len(d[0]) > 2):
					values.append(d[0])
				else:
					keys.append(d[0])

		state_names = dict(list(zip(keys, values)))

		with open('data.json', 'w') as fp:
			json.dump(state_names, fp)


	states = []
	for state in data.keys():
		states.append(state)

	total = []
	for state in states:
		try:
			cases = data[state]['total']
		except:
			cases = None
		total.append(cases)

	confirmed = []
	deceased = []
	recovered = []
	tested = []

	for cases in total:
		confirmed.append(cases.get('confirmed', -1))
		deceased.append(cases.get('deceased', -1))
		recovered.append(cases.get('recovered', -1))
		tested.append(cases.get('tested', -1))

	df_state = pd.DataFrame()
	df_state['Code'] = states
	df_state['State'] = [state_names.get(i, getStateName(i)) for i in states]
	df_state['Confirmed'] = confirmed
	df_state['Deceased'] = deceased
	df_state['Recovered'] = recovered
	df_state['Active'] = df_state['Confirmed'] - df_state['Recovered'] - df_state['Deceased']
	df_state['Tested'] = tested

	df_state = df_state.sort_values(by=['Confirmed'], ascending=False)
	df_state = df_state.reset_index(drop=True)
	df_state = df_state[1:]

	object = {
		'State' : df_state['State'],
		'Confirmed' : df_state['Confirmed']
	}

	return json.dumps(object, cls=plotly.utils.PlotlyJSONEncoder)



@app.route('/state', methods=['POST'])
def getStateData():
	sname = request.form.get('state', 'Maharashtra', type=str)

	df = df_state[df_state['State']==sname]

	data = {
		'Confirmed' : str(df['Confirmed'].values[0]),
		'Recovered': str(df['Recovered'].values[0]),
		'Deceased': str(df['Deceased'].values[0]),
		'Tested': str(df['Tested'].values[0]),
		'Active': str(df['Active'].values[0]),
	}
	return jsonify(state = data)


@app.route('/district', methods=['POST'])
def getDistrictData():
	dname = request.form.get('district', None, type=str)

	if(dname==None):
		data = {
			'Confirmed': str(0),
			'Recovered': str(0),
			'Deceased': str(0),
			'Tested': str(0),
			'Active': str(0),
		}
		return jsonify(district=data)

	df = df_district[df_district['index']==dname]

	data = {
		'Confirmed' : str(df['Confirmed'].values[0]),
		'Recovered': str(df['Recovered'].values[0]),
		'Deceased': str(df['Deceased'].values[0]),
		'Tested': str(df['Tested'].values[0]),
		'Active': str(df['Active'].values[0]),
		'district_deceased_avg' : str(np.mean(df_district['Deceased'])),
		'district_active_avg' : str(np.mean(df_district['Active'])),
		'district_recovered_avg' : str(np.mean(df_district['Recovered'])),
		'district_tested_avg' : str(np.mean(df_district['Tested'])),
		'district_confirmed_avg' : str(np.mean(df_district['Confirmed']))
	}
	return jsonify(district = data)



def exponenial_func_two(x, a = 1/np.sqrt(2), b = np.sqrt(2)):
	return a * (b**x)


def exponenial_func_four(x, a = 1/(2**(1/4)), b = 2**(1/4)):
	return a * (b**x)


def exponenial_func_ten(x, a = 1/(2**(1/10)), b = 2**(1/10)):
	return a * (b**x)


def exponenial_func_seven(x, a = 1/(2**(1/7)), b = 2**(1/7)):
	return a * (b**x)


def exponenial_func_twelve(x, a = 1/(2**(1/12)), b = 2**(1/12)):
	return a * (b**x)


def prepare_district_data(scode):
	global df_district
	global df_state

	URL = 'https://api.covid19india.org/v4/data.json'

	with urllib.request.urlopen(URL) as url:
		data = json.loads(url.read().decode())

	district_dict = dict()

	for district in data[scode]['districts'].keys():
		district_dict[district] = data[scode]['districts'][district]['total']

	df_district = pd.DataFrame(district_dict).T
	df_district = df_district.rename(columns={'confirmed': 'Confirmed', 'deceased': 'Deceased', 'recovered': 'Recovered', 'tested': 'Tested'})
	df_district['Active'] = df_district['Confirmed'] - df_district['Recovered'] - df_district['Deceased']
	try:
		df_district = df_district.drop(['other'], axis=1)
	except:
		pass
	df_district = df_district.fillna(0)
	df_district = df_district.reset_index()


def get_key(val, d):
	for key, value in d.items():
		if val == value:
			return key

	return -1


@app.route('/update_districts', methods = ['POST'])
def update_districts():
	sname = request.form.get('state', 'Maharashtra', type=str)
	scode = get_key(sname, state_names)

	if(scode==-1):
		object = {
			'district_cols': [],
			'district_rows': []
		}
		return jsonify(district=object)

	prepare_district_data(scode)
	district_cols = df_district.columns.values.tolist()
	district_rows = df_district.values.tolist()

	object = {
		'district_cols': district_cols,
		'district_rows': district_rows
	}

	return jsonify(district = object)



@app.route('/')
def index():
	global df_nation
	global df_state

	world_heat = world_heatmap()
	numbers = get_numbers()

	world_df_time = prepare_world_timeseries()

	dates.reverse()
	df_nation = df_nation[dates]

	nation_heat = prepare_state_data()

	npie_labels = ['Confirmed', 'Deceased', 'Recovered', 'Active']
	npie_cases = [df_nation.loc['Total Confirmed', dates[-1]], df_nation.loc['Total Deceased', dates[-1]],
			 df_nation.loc['Total Recovered', dates[-1]], df_nation.loc['Total Active', dates[-1]]]

	total_confirmed = df_nation.loc['Total Confirmed',:].astype(int).values.tolist()
	total_recovered = df_nation.loc['Total Recovered',:].astype(int).values.tolist()
	total_deceased = df_nation.loc['Total Deceased',:].astype(int).values.tolist()
	total_active = df_nation.loc['Total Active',:].astype(int).values.tolist()
	total_tested = df_nation.loc['Total Tested',:].str.replace(',','').fillna(0).astype(int).values.tolist()

	daily_confirmed = df_nation.loc['Daily Confirmed',:].astype(int).values.tolist()
	daily_recovered = df_nation.loc['Daily Recovered',:].astype(int).values.tolist()
	daily_deceased = df_nation.loc['Daily Deceased',:].astype(int).values.tolist()
	daily_active = df_nation.loc['Daily Active',:].astype(int).values.tolist()
	daily_tested = df_nation.loc['Daily Tested',:].str.replace(',','').fillna(0).astype(int).values.tolist()

	total_confirmed_log = np.log(total_confirmed)
	total_confirmed_log[total_confirmed_log == -inf] = 0
	total_confirmed_log[total_confirmed_log ==  inf] = 0
	total_confirmed_log = total_confirmed_log.tolist()

	array = np.array(total_deceased)
	array[array == -inf] = 1
	array[array == inf] = 1
	array[array == 0] = 1
	total_deceased_log = np.log(array)
	total_deceased_log[total_deceased_log == -inf] = 0
	total_deceased_log[total_deceased_log == inf] = 0
	total_deceased_log = total_deceased_log.tolist()

	array = np.array(total_tested)
	array[array == -inf] = 1
	array[array == inf] = 1
	array[array == 0] = 1
	total_tested_log = np.log(array)
	total_tested_log[total_tested_log == -inf] = 0
	total_tested_log[total_tested_log == inf] = 0
	total_tested_log = total_tested_log.tolist()

	array = np.array(total_active)
	array[array == -inf] = 1
	array[array == inf] = 1
	array[array == 0] = 1
	total_active_log = np.log(array)
	total_active_log[total_active_log == -inf] = 0
	total_active_log[total_active_log == inf] = 0
	total_active_log = total_active_log.tolist()

	array = np.array(total_recovered)
	array[array == -inf] = 1
	array[array == inf] = 1
	array[array == 0] = 1
	total_recovered_log = np.log(array)
	total_recovered_log[total_recovered_log == -inf] = 0
	total_recovered_log[total_recovered_log == inf] = 0
	total_recovered_log = total_recovered_log.tolist()

	positivity_rate = df_nation.loc['Positivity Rate',:].str.replace('%','').replace('',0).fillna(method='ffill').fillna(0).astype(float).replace(0,method='ffill').tolist()
	cases_pm = df_nation.loc['Cases PM',:].astype(int).values.tolist()
	tests_pm = df_nation.loc['Tests PM',:].astype(int).values.tolist()

	dates.reverse()
	df_nation = df_nation[dates]

	df_state = df_state.sort_values(by='Confirmed', ascending=False)

	prepare_district_data(df_state['Code'].values[0])

	district_cols = df_district.columns.values.tolist()
	district_rows = df_district.values.tolist()

	state_labels = df_state['State'][0:10].values.tolist()
	state_confirmed = df_state['Confirmed'][0:10].values.tolist()
	state_deceased = df_state['Deceased'][0:10].values.tolist()
	state_active = df_state['Active'][0:10].values.tolist()
	state_recovered = df_state['Recovered'][0:10].values.tolist()
	state_tested = df_state['Tested'][0:10].values.tolist()
	state_labels_full = df_state['State'].values.tolist()
	state_confirmed_full = df_state['Confirmed'].values.tolist()
	state_tested_full = df_state['Tested'].values.tolist()
	state_deceased_full = df_state['Deceased'].values.tolist()

	days = int((datetime.strptime(end_date,'%d/%m/%Y') -
									  datetime.strptime('22/01/2020','%d/%m/%Y')).days)

	world_trend_x = list(range(1, days + 1))

	max_confirmed = int(json.loads(world_df_time)[countries[0]]['Confirmed'][-1]) * 1.5

	#2 day variables

	x_two = np.array(list(range(1, days + 10, 1)))
	y_two = exponenial_func_two(x_two)
	y_two = (y_two[y_two<max_confirmed]).tolist()
	x_two = [x_two[i] for i in range(0,len(y_two))]

	#4 day variables

	x_four = np.array(list(range(1, days + 10, 1)))
	y_four = exponenial_func_four(x_four)
	y_four = (y_four[y_four<max_confirmed]).tolist()
	x_four = [x_four[i] for i in range(0,len(y_four))]


	#10 day variables

	x_ten = np.array(list(range(1, days + 10, 1)))
	y_ten = exponenial_func_ten(x_ten)
	y_ten = (y_ten[y_ten<max_confirmed]).tolist()
	x_ten = [x_ten[i] for i in range(0,len(y_ten))]


	#7 day variables

	x_seven = np.array(list(range(1, days + 10, 1)))
	y_seven = exponenial_func_seven(x_seven)
	y_seven = (y_seven[y_seven<max_confirmed]).tolist()
	x_seven = [x_seven[i] for i in range(0,len(y_seven))]


	#12 day variables

	x_twelve = np.array(list(range(1, days + 10, 1)))
	y_twelve = exponenial_func_twelve(x_twelve)
	y_twelve = (y_twelve[y_twelve<max_confirmed]).tolist()
	x_twelve = [x_twelve[i] for i in range(0,len(y_twelve))]

	mortality_rate = np.round(np.array(json.loads(world_df_time)['India']['Mortality']) * 100, 2).tolist()


	return render_template('index.html',

						   world_heat=world_heat, numbers = numbers, world_cols = world_df.columns.values,
						   world_rows = world_df.values.tolist(),

						   nation_cols = df_nation.reset_index().columns.values, nation_rows = df_nation.reset_index().values.tolist(),
						   npie_labels = npie_labels, npie_cases = npie_cases, end_date = end_date,

						   df_state = nation_heat, state_cols = df_state.columns.values, state_rows = df_state.values.tolist(),

						   total_confirmed = total_confirmed, total_deceased = total_deceased, total_recovered = total_recovered,
						   total_tested = total_tested, total_active = total_active, dates = list(reversed(dates)),

						   daily_confirmed = daily_confirmed, daily_deceased = daily_deceased, daily_tested = daily_tested,
						   daily_active = daily_active, daily_recovered = daily_recovered,

						   total_confirmed_log = total_confirmed_log, total_deceased_log = total_deceased_log,
						   total_tested_log = total_tested_log, total_active_log = total_active_log,
						   total_recovered_log = total_recovered_log,

						   positivity_rate = positivity_rate, cases_pm = cases_pm, tests_pm = tests_pm,

						   state_labels = state_labels, state_confirmed = state_confirmed, state_recovered = state_recovered,
						   state_active = state_active, state_tested = state_tested, state_deceased = state_deceased,
						   state_labels_full = state_labels_full, state_confirmed_full = state_confirmed_full,
						   state_tested_full = state_tested_full, state_deceased_full = state_deceased_full,

						   countries = countries, world_df_time = world_df_time, world_trend_x = world_trend_x,

						   x_two = x_two[-1], y_two = y_two[-1], x_four = x_four[-1], y_four = y_four[-1],
						   x_ten = x_ten[-1], y_ten = y_ten[-1], x_seven = x_seven[-1], y_seven = y_seven[-1],
						   x_twelve = x_twelve[-1], y_twelve = y_twelve[-1], mortality_rate = mortality_rate,

						   state_confirmed_avg = np.mean(df_state['Confirmed']), state_deceased_avg = np.mean(df_state['Deceased']),
						   state_active_avg=np.mean(df_state['Active']), state_recovered_avg = np.mean(df_state['Recovered']),
						   state_tested_avg=np.mean(df_state['Tested']),

						   district_cols = district_cols, district_rows = district_rows,
						   districts = df_district['index'].values.tolist(), district_deceased_avg = np.mean(df_district['Deceased']),
						   district_active_avg=np.mean(df_district['Active']), district_recovered_avg = np.mean(df_district['Recovered']),
						   district_tested_avg=np.mean(df_district['Tested']), district_confirmed_avg = np.mean(df_district['Confirmed'])

						   )


if (__name__ == '__main__'):
	app.run(debug=True, port=8000, threaded=True)
