
#pragma once

#include "Mutex.h"
#include "Thread.h"

#include <string>
#include <queue>
#include <map>

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
	void ResponsePush(std::string json, std::string session_id);
	bool ResponsePeek(std::string &json, int msecs, std::string session_id);
	void ResponsePop(std::string session_id);
	int ResponseQueueSize(std::string session_id);

	virtual void DoWork(std::string &json)=0;

private:
	typedef std::queue<std::string> WQueue_t;
	typedef std::map<std::string, WQueue_t*> WQMap_t;

	void Push(WQueue_t *q, std::string json);
	bool Peek(WQueue_t *q, std::string &json, int msecs);
	void Pop(WQueue_t *q);
	int Size(WQueue_t *q);

	// one request queue for all session ids
	WQueue_t mRequestQueue;
	// a response queue per session_id
	WQMap_t mRespQMap;

	// stats
	uint64_t mTotalRequests;
};