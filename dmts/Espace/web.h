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

	// Webserver
	// Use wq if set, otherwise use data buffer
	explicit WebServer(const char *port, WorkerQueue *wq);

	~WebServer();

	// only available if databuffer constructor is used
	void AppendDataBuffer(std::string data);
	void SetDataBuffer(std::string data);
	void SetDataBufferMaxLen(int len);

	void Run();

	// internal via callbaks
	int HandleRequest(sb_Event *e);
private:
	void Init(const char* port);
	sb_Server   *mServer;
	WorkerQueue *mWq;
	sb_Options   mOptions;
	int          mCalled;
	bool         mUseDataBuffer;
	std::string  mDataBuffer;
	int          mMaxDbLen;
};

