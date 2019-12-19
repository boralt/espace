#pragma once

#include <vector>
#include <json-forwards.h>

// search run configuration
class RunConfig
{

public:

	RunConfig();
	RunConfig(Json::Value &v);


	void ConfigureDefault();


	int num_channels;
	int num_traffic_classes;
	int num_fec;
	int try_chunk;     // quanta of traffc allocation

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


};
