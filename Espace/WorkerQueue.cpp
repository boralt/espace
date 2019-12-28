
#include "WorkerQueue.h"

WorkerQueue::WorkerQueue()
{
	mTotalRequests=0;
}

WorkerQueue::~WorkerQueue()
{
	// TODO: free map queues
}

int WorkerQueue::Size(WQueue_t *q)
{
	int sz=0;
	Lock();
	sz=q->size();
	Unlock();
	return sz;
}

void WorkerQueue::Pop(WQueue_t *q)
{
	Lock();
	q->pop();
	Unlock();
}

void WorkerQueue::Push(WQueue_t *q, std::string json)
{
	Lock();
	q->push(json);
	Unlock();
}

bool WorkerQueue::Peek(WQueue_t *q, std::string &json, int msecs)
{
	bool rc=false;

	while (Size(q) == 0)
	{
		// wait for data
		if (msecs<=0)
		{
			return false;
		}
		msecs-=10;
		MSLEEP(10);
	}

	Lock();
	if (!q->empty())
	{
		json = q->front();
		rc=true;
	}
	Unlock();
	return rc;
}


int WorkerQueue::RequestQueueSize()
{
	return Size(&mRequestQueue);
}

void WorkerQueue::RequestPop()
{
	Pop(&mRequestQueue);
}


bool WorkerQueue::RequestPeek(std::string &json, int msecs)
{
	return Peek(&mRequestQueue,json,msecs);
}


void WorkerQueue::RequestPush(std::string json)
{
	mTotalRequests++;
	return Push(&mRequestQueue,json);
}

uint64_t WorkerQueue::TotalRequests()
{
	return mTotalRequests;
}

int WorkerQueue::ResponseQueueSize( std::string session_id)
{
	int sz=0;
	if (mRespQMap.find(session_id) != mRespQMap.end())
	{
		sz = Size(mRespQMap[session_id]);
	}
	return sz;
}

void WorkerQueue::ResponsePop( std::string session_id)
{
	if (mRespQMap.find(session_id) != mRespQMap.end())
	{
		Pop(mRespQMap[session_id]);
	}
}


bool WorkerQueue::ResponsePeek(std::string &json, int msecs,  std::string session_id)
{
	if (mRespQMap.find(session_id) != mRespQMap.end())
	{
		return Peek(mRespQMap[session_id], json, msecs);
	}
	return false;
}


void WorkerQueue::ResponsePush(std::string json,  std::string session_id)
{
	if (mRespQMap.find(session_id) == mRespQMap.end())
	{
		mRespQMap[session_id] = new WQueue_t();
	}
	return Push(mRespQMap[session_id], json);
}

void WorkerQueue::Run()
{
	std::string json;

	while (!IsStop())
	{
		if (RequestPeek(json, 1000))
		{
			DoWork(json);
			RequestPop();
		}
	}
}

