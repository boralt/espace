#pragma once

#include <vector>
#include <json-forwards.h>
#include "web.h"
#include <string>
#include "json.h"

// search run configuration
class RunConfig
{

public:

	RunConfig();

	bool ParseJson(std::string &json);

	int num_channels;
	int num_traffic_classes;
	int num_fec;
	int try_chunk;     // quanta of traffc allocation
	int max_loop;

	std::vector<int> LofC;		// latency of channel
	std::vector<int> JofC;		// jitter of channel
	std::vector<int> BoC;		// Bandwidth of channel
	std::vector<int> DoC;		// Drop of channel

	std::vector<int> FecMult;   // FEC bw efficiency multiplier
	std::vector<int> FecDiv;	// FEC drop divider

	std::vector<int> Treq;      // Traffic bw requirements
	std::vector<int> tcJitterCost; // cost of jitter for traffic claass
	std::vector<int> tcLatencyCost; // cost of latency 
	std::vector<int> tcDropCost;	// cost of packet drop

	// Debug output
	void WriteDebug(std::string str);
	void WriteDebug(const char *fmt, ...);
	WebServer *debug_server;
private:
	bool AddArrayValues(std::vector<int> *vec, const Json::Value values);
	typedef  std::pair<std::string,std::vector<int> *>  VP;
	std::map<std::string,std::vector<int> *> mSchemaMap;
	std::vector<std::string> mCategories;
};
