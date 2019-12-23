// Espace.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
#include <unistd.h>
#include <fstream>

#include "Mutex.h"
#include "run_config.h"
#include "web.h"
#include "WorkerQueue.h"

using namespace std;

extern std::string Algorithm(RunConfig &_rc);
extern int min_cost;

#define WEB_SERVER_PORT "7777"


// for now place in executable dir
#define CFG_PATH "./config.json"

bool ReadFile(std::string filepath,  std::string &json)
{
	std::ifstream infile;
	std::string line;
	json="";
	infile.open (filepath);
	if (!infile.good())
	{
		return false;
	}
	while(!infile.eof())
	{
		getline(infile,line);
		//cout<<line;
		json+=line;
	}
	infile.close();

	return true;
}

class RequestWork : public WorkerQueue
{
public:
	RequestWork(){};
	~RequestWork(){};

	void DoWork(std::string &json)
	{
		RunConfig cfg;
		std:string ResultJson;
		char buf[256];

		if (!cfg.ParseJson(json))
		{
			cout << "Could not parse json" << endl;
			return;
		}

		ResultJson="{\"request\":"+json+",";
		ResultJson+="\"result\":";
		ResultJson+=Algorithm(cfg);
		ResultJson+="}";
		ResponseAdd(ResultJson);

		sprintf(buf,"Min Cost = %d\n", min_cost);
		std::cout << buf << std::endl;

		cout << ResultJson << endl;
	}

private:

};


int main()
{
	char buf[256];

	RequestWork wq;
	WebServer  ws(WEB_SERVER_PORT,&wq);

	// start worker queue thread
	wq.Start();
	// start web server thread
	ws.Start();

	// main process thread does nothing
	// TODO: need to add kill signal
	while (1)
	{
		MSLEEP(1000);
	}

	ws.Stop();
	wq.Stop();

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
