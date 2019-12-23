
#include "run_config.h"
#include <iostream>

using namespace std;

RunConfig::RunConfig() :
	num_channels(0),
	num_traffic_classes(0),
	num_fec(0), 
	try_chunk(0),
	debug_server(NULL),
	max_loop(0)
{
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

bool RunConfig::ParseJson(std::string &json)
{
	Json::Reader reader;
	Json::Value root;
	Json::Value cat;
	std::map<std::string,std::vector<int> *>::iterator it;
	int x,y,sz;

	if (!reader.parse(json, root))
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
		vec->push_back(values[x].asInt());
	}
	return true;
}

void RunConfig::WriteDebug(std::string str)
{
	if (debug_server)
	{
		debug_server->AppendDataBuffer(str);
	}
	// to console
	cout << str;
}

void RunConfig::WriteDebug(const char *fmt, ...)
{
	char buf[4096];
	va_list args;
	va_start(args, fmt);
	vsnprintf(buf,4095, fmt, args);
	va_end(args);
	WriteDebug(std::string(buf));
}

