
#pragma once

#include "Mutex.h"
#include "Thread.h"

#include <string>
#include <queue>

using namespace std;

class WorkerQueue : public Thread
{
public:

	WorkerQueue();

	~WorkerQueue();

	void Run();

	// Add a request to queue
	void RequestAdd(std::string json);
	// Remove request form queue. Wait up to msecs for data
	bool RequestRemove(std::string &json, int msecs);
	int RequestQueueSize();

	// Add a request to queue
	void ResponseAdd(std::string json);
	// Remove request form queue. Wait up to msecs for data
	bool ResponseRemove(std::string &json, int msecs);
	int ResponseQueueSize();

	virtual void DoWork(std::string &json)=0;

private:
	std::queue<std::string> mRequestQueue;
	std::queue<std::string> mResponseQueue;
};