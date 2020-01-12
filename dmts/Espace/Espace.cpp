// Espace.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>

#if !defined(_WIN32)
#include <unistd.h>
#endif
#include <fstream>

#include "Mutex.h"
#include "ResultsDb.h"
#include "run_config.h"
#include "web.h"
#include "WorkerQueue.h"

using namespace std;

extern std::string Algorithm(RunConfig &_rc);
extern int min_cost;

#define WEB_SERVER_PORT "7777"
#define WEB_SERVER_PORT_DEBUG "7778"


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
	RequestWork(ResultsDb *resultsDb)
	{
		mWsDebug=NULL;
		mCount=0;
		mResultsDb = resultsDb;
	};

	~RequestWork(){};

	void DoWork(std::string &json)
	{
		Json::Reader reader;
		Json::Value  root;
		Json::Value  cat;
		unsigned int x;

		if (!reader.parse(json, root))
		{
			printf("ERROR: Could not parse json...expecting array\n");
			return;
		}

		cat    = root["requests"];
		for (x = 0; x < cat.size(); x++)
		{
			std::string ResultJson;
			std::string tJson;
			char        tbuf[256];
			uint64_t    start_ts, end_ts;
			RunConfig   cfg;

			cfg.debug_server = mWsDebug;
			mCount++;
			cfg.WriteDebug("\n\n----------------Request %d ----------------------\n", mCount);
			//cfg.WriteDebug("Json Request:\n %s\n\n", cat[x].c_str());

			if (!cfg.ParseJson(cat[x]))
			{
				cfg.WriteDebug("Could not parse json\n");
				return;
			}

			// Run the algorithm
			start_ts = CurrentTimeMsecs();
			tJson    = Algorithm(cfg);
			end_ts   = CurrentTimeMsecs();

			// Build JSON response
			ResultJson = "{";
			snprintf(tbuf, 255, "%llu.%03llu", end_ts / 1000, end_ts % 1000);
			ResultJson += "\"result_ready_time\":" + string(tbuf) + ",";
			ResultJson += "\"processing_time_ms\":" + std::to_string(end_ts - start_ts) + ",";
			ResultJson += "\"request\":" + json + ",";
			ResultJson += "\"result\":" + tJson;
			ResultJson += "}";

			// add to DB
			mResultsDb->Add(ResultJson, cfg.session_id, cfg.start_ts);

			// Add response to response queue
			ResponsePush(ResultJson, cfg.session_id);

			cfg.WriteDebug("Min Cost = %d\n", min_cost);
			cfg.WriteDebug("Json Result:\n %s\n", ResultJson.c_str());
		}
	}

	void SetDebugServer(WebServer *ws)
	{
		mWsDebug=ws;
	}

private:
	ResultsDb *mResultsDb;
	WebServer *mWsDebug;
	int mCount;
};


#if !defined(_SIMPLE_RUN)
int main()
{
	char buf[256];
	ResultsDb resultsDb;
	RequestWork wq(&resultsDb);
	// used for official GET/POST of JSON data
	WebServer  ws(WEB_SERVER_PORT,&wq,&resultsDb);
	// second web server for debug output only
	WebServer  wsDebug(WEB_SERVER_PORT_DEBUG,NULL, NULL);

	wq.SetDebugServer(&wsDebug);

	// start worker queue thread
	wq.Start();
	// start web server threads
	ws.Start();
	wsDebug.Start();

	// main process thread does nothing
	// TODO: need to add kill signal
	while (1)
	{
		MSLEEP(1000);
	}

	ws.Stop();
	wq.Stop();
	wsDebug.Stop();

	return 0;

}
#else

extern int min_cost;
int main()
{
    min_cost = 23000;
	std::string s;
	ReadFile(CFG_PATH, s);
	ResultsDb resultsDb;
	RequestWork wq(&resultsDb);
	wq.DoWork(s);
	return 0;

}


#endif


// Run program: Ctrl + F5 or Debug > Start Without Debugging menu
// Debug program: F5 or Debug > Start Debugging menu

// Tips for Getting Started: 
//   1. Use the Solution Explorer window to add/manage files
//   2. Use the Team Explorer window to connect to source control
//   3. Use the Output window to see build output and other messages
//   4. Use the Error List window to view errors
//   5. Go to Project > Add New Item to create new code files, or Project > Add Existing Item to add existing code files to the project
//   6. In the future, to open this project again, go to File > Open > Project and select the .sln file
