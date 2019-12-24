
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

	// Request Queue is processed by DoWork()
	void RequestPush(std::string json);
	bool RequestPeek(std::string &json, int msecs);
	void RequestPop();
	int RequestQueueSize();
	uint64_t TotalRequests();

	// Response Queue is result of DoWork()
	void ResponsePush(std::string json);
	bool ResponsePeek(std::string &json, int msecs);
	void ResponsePop();
	int ResponseQueueSize();

	virtual void DoWork(std::string &json)=0;

private:
	void Push(std::queue<std::string> *q, std::string json);
	bool Peek(std::queue<std::string> *q, std::string &json, int msecs);
	void Pop(std::queue<std::string> *q);
	int Size(std::queue<std::string> *q);

	std::queue<std::string> mRequestQueue;
	std::queue<std::string> mResponseQueue;
	uint64_t mTotalRequests;
};