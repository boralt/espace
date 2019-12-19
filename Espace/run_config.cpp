
#include "run_config.h"
#include "json.h"

RunConfig::RunConfig() :
	num_channels(0),
	num_traffic_classes(0),
	num_fec(0), 
	try_chunk(0)
{

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

