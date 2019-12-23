//
// Web Server
//

#pragma once

#include <cstdint>
#include "Thread.h"
#include "WorkerQueue.h"
#include "sandbird.h"

#pragma comment(lib, "Ws2_32.lib")

class WebServer : public Thread
{
public:

	explicit WebServer(const char *port, WorkerQueue *wq);
	~WebServer();

	void AppendDataBuffer(std::string data);
	void SetDataBuffer(std::string data);

	void Run();

	// internal via callbaks
	int HandleRequest(sb_Event *e);
private:
	sb_Server   *mServer;
	WorkerQueue *mWq;
	sb_Options   mOptions;
	int          mCalled;
	std::string  mDataBuffer;
};

