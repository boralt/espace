
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
		cout << "illegal JSON" << endl;
		return false;
	}

	cat = root["channels"];
	for (x = 0; x < cat.size(); x++)
	{
		//cout << cat[x] << endl;
		if (cat[x]["latency_ms"].empty())
		{
			cout << "Expecting 'channels:latency_ms'" << endl;
			return false;
		}
		LofC.push_back(cat[x]["latency_ms"].asInt());

		if (cat[x]["bw_kbps"].empty())
		{
			cout << "Expecting 'channels:bw_kbps'" << endl;
			return false;
		}
		BoC.push_back(cat[x]["bw_kbps"].asInt());

		if (cat[x]["drop_percent"].empty())
		{
			cout << "Expecting 'channels:drop_percent'" << endl;
			return false;
		}
		DoC.push_back(cat[x]["drop_percent"].asInt());

		if (cat[x]["jitter_ms"].empty())
		{
			cout << "Expecting 'channels:jitter_ms'" << endl;
			return false;
		}
		JofC.push_back(cat[x]["jitter_ms"].asInt());
	}

	cat = root["traffic_classes"];
	for (x = 0; x < cat.size(); x++)
	{
		//cout << cat[x] << endl;
		if (cat[x]["latency_cost"].empty())
		{
			cout << "Expecting 'traffic_classes:latency_cost'" << endl;
			return false;
		}
		tcLatencyCost.push_back(cat[x]["latency_cost"].asInt());

		if (cat[x]["bw_kbps"].empty())
		{
			cout << "Expecting 'traffic_classes:bw_kbps'" << endl;
			return false;
		}
		Treq.push_back(cat[x]["bw_kbps"].asInt());

		if (cat[x]["drop_cost"].empty())
		{
			cout << "Expecting 'traffic_classes:drop_cost'" << endl;
			return false;
		}
		tcDropCost.push_back(cat[x]["drop_cost"].asInt());

		if (cat[x]["jitter_cost"].empty())
		{
			cout << "Expecting 'traffic_classes:jitter_cost'" << endl;
						return false;
		}
		tcJitterCost.push_back(cat[x]["jitter_cost"].asInt());
	}

	cat = root["fec"];
	for (x = 0; x < cat.size(); x++)
	{
		//cout << cat[x] << endl;
		if (cat[x]["multiplier"].empty())
		{
			cout << "Expecting 'fec:multiplier'" << endl;
			return false;
		}
		FecMult.push_back(cat[x]["multiplier"].asInt());

		if (cat[x]["divider"].empty())
		{
			cout << "Expecting 'fec:divider'" << endl;
			return false;
		}
		FecDiv.push_back(cat[x]["divider"].asInt());
	}

	// set the size values
	try_chunk = root["try_chunk"].asInt();
	num_traffic_classes = Treq.size();
	num_fec = FecMult.size();
	num_channels = LofC.size();

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

