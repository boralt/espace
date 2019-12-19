//
// Web Server
//

#pragma once

#include <pthread.h>
#include <cstdint>
#include "sandbird.h"

class WebServer
{
public:

	explicit WebServer(const char *port);
	~WebServer();

	bool Start();
	void Stop();

	void AppendDataBuffer(std::string data);
	void SetDataBuffer(std::string data);

	// internal via callbaks
	int HandleRequest(sb_Event *e);
	void Run();
private:
	bool        mStopped;
	sb_Server  *mServer;
	pthread_t   mTid;
	sb_Options  mOptions;
	int         mCalled;
	std::string mDataBuffer;
};

