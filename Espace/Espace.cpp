// Espace.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <zconf.h>
#include "run_config.h"
#include "web.h"


extern void Algorithm(RunConfig &_rc);
extern int min_cost;

#define WEB_SERVER_PORT "7777"

int main()
{
	RunConfig rc;
	WebServer  ws(WEB_SERVER_PORT);
	char buf[256];
	std::string json_str;

	rc.ws = &ws;
#if 0
	rc.ConfigureDefault();
#else  // read from json file
	if (!rc.LoadJsonConfigFromFile())
	{
		return 0;
	}
#endif
	// start web server (creates pthread)
	ws.Start();

	Algorithm(rc);
	sprintf(buf,"***********************\nCost = %d\n", min_cost);
	ws.AppendDataBuffer(buf);
	std::cout << buf << std::endl;

	sleep(30); // let web server run a bit
	ws.Stop();

	return 0;

}

// Run program: Ctrl + F5 or Debug > Start Without Debugging menu
// Debug program: F5 or Debug > Start Debugging menu

// Tips for Getting Started: 
//   1. Use the Solution Explorer window to add/manage files
//   2. Use the Team Explorer window to connect to source control
//   3. Use the Output window to see build output and other messages
//   4. Use the Error List window to view errors
//   5. Go to Project > Add New Item to create new code files, or Project > Add Existing Item to add existing code files to the project
//   6. In the future, to open this project again, go to File > Open > Project and select the .sln file
