
#include "run_config.h"
#include <iostream>
#include <fstream>

using namespace std;

RunConfig::RunConfig() :
	num_channels(0),
	num_traffic_classes(0),
	num_fec(0), 
	try_chunk(0)
{
	ws=NULL;

	// Init JSON schema map into vectors
	// Channels
	mSchemaMap.insert(VP("ch_latency_ms",&LofC));
	mSchemaMap.insert(VP("ch_jitter_ms",&JofC));
	mSchemaMap.insert(VP("ch_bw_kbps",&BoC));
	mSchemaMap.insert(VP("ch_pkt_drop",&DoC));
	// traffic_classes
	mSchemaMap.insert(VP("tc_bw_kbps",&Treq));
	mSchemaMap.insert(VP("tc_jitter_cost",&tcJitterCost));
	mSchemaMap.insert(VP("tc_latency_cost",&tcLatencyCost));
	mSchemaMap.insert(VP("tc_pkt_drop_cost",&tcDropCost));
	// fec
	mSchemaMap.insert(VP("fec_multiplier",&FecMult));
	mSchemaMap.insert(VP("fec_divider",&FecDiv));

	mCategories.emplace_back("channels");
	mCategories.emplace_back("traffic_classes");
	mCategories.emplace_back("fec");
}

RunConfig::RunConfig(Json::Value& v)
{


}


void 
RunConfig::ConfigureDefault()
{
	num_channels = 4;
	num_traffic_classes = 8;
	num_fec = 3;

	// channel 0 is unallocated

	LofC = { 2000, 100,200,300 };
	JofC = { 600,30,10,40 };
	BoC = { 9000000, 10000, 20000, 40000 };
	DoC = { 1000, 1, 2, 3 };

	FecMult = { 100, 110, 150 };
	FecDiv = { 1, 2, 3 };


	Treq = {
	   5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000
	};

	tcJitterCost =
	{
	   9,8,7,6,5,4,3,2
	};


	tcLatencyCost =
	{

	   9,8,7,6,5,4,3,2
	};

	tcDropCost =
	{
	   9,8,7,6,5,4,3,2
	};

	try_chunk = 1000;
}

// for now place in executable dir
#define CFG_PATH "./config.json"

bool RunConfig::LoadJsonConfigFromFile()
{
	if (!ReadFile())
	{
		cout << "Could not read [" + string(CFG_PATH) + "]" << endl;
		return false;
	}

	if (!ParseJson())
	{
		cout << "Could not parse [" + string(CFG_PATH) + "]" << endl;
		return false;
	}

	return true;
}

bool RunConfig::ReadFile()
{
	std::ifstream infile;
	std::string line;
	mJsonData="";
	infile.open (CFG_PATH);
	if (!infile.good())
	{
		return false;
	}
	while(!infile.eof())
	{
		getline(infile,line);
		//cout<<line;
		mJsonData+=line;
	}
	infile.close();

	return true;
}

bool RunConfig::ParseJson()
{
	Json::Reader reader;
	Json::Value root;
	Json::Value cat;
	std::map<std::string,std::vector<int> *>::iterator it;
	int x,y,sz;

	if (!reader.parse(mJsonData, root))
	{
		return false;
	}

	for (x=0;x<mCategories.size();x++)
	{
		sz=0;
		cat = root[mCategories[x]];
		for (y = 0; y < cat.size(); y++)
		{
			//cout << cat[x]["name"] << endl;
			it = mSchemaMap.find(cat[y]["name"].asString());
			if (it != mSchemaMap.end())
			{
				if (!AddArrayValues(it->second, cat[y]["values"]))
				{
					return false;
				}
				if (!sz)
				{
					sz = it->second->size();
				}
				else if (sz != it->second->size())
				{
					cout << "Error: array size mismatch in JSON for " <<  it->first << endl;
					return false;
				}
			}
		}
	}

	// set the size values
	try_chunk = root["try_chunk"].asInt();
	num_traffic_classes = Treq.size();
	num_fec = FecMult.size();
	num_channels = LofC.size();

	return true;
}

bool RunConfig::AddArrayValues(std::vector<int> *vec, const Json::Value values)
{
	int x;
	if (!values.isArray())
	{
		return false;
	}
	for (x=0;x<values.size();x++)
	{
		//cout << values[x].asInt() << endl;
		vec->push_back(values[x].asInt());
	}
	return true;
}

