//
// Web Server
//

#pragma once

#if !defined(_WIN32)
#include <pthread.h>
#else
#include <windows.h>
#endif

#include <cstdint>
#include "sandbird.h"

#pragma comment(lib, "Ws2_32.lib")

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
#if !defined _WIN32
	pthread_t   mTid;
#else
	HANDLE mTid;
#endif

	sb_Options  mOptions;
	int         mCalled;
	std::string mDataBuffer;
};

