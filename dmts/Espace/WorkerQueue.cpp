
#include "WorkerQueue.h"

WorkerQueue::WorkerQueue()
{
	mTotalRequests=0;
}

WorkerQueue::~WorkerQueue()
{

}

int WorkerQueue::Size(std::queue<std::string> *q)
{
	int sz=0;
	Lock();
	sz=q->size();
	Unlock();
	return sz;
}

void WorkerQueue::Pop(std::queue<std::string> *q)
{
	Lock();
	q->pop();
	Unlock();
}

void WorkerQueue::Push(std::queue<std::string> *q, std::string json)
{
	Lock();
	q->push(json);
	Unlock();
}

bool WorkerQueue::Peek(std::queue<std::string> *q, std::string &json, int msecs)
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

int WorkerQueue::ResponseQueueSize()
{
	return Size(&mResponseQueue);
}

void WorkerQueue::ResponsePop()
{
	Pop(&mResponseQueue);
}


bool WorkerQueue::ResponsePeek(std::string &json, int msecs)
{
	return Peek(&mResponseQueue,json,msecs);
}


void WorkerQueue::ResponsePush(std::string json)
{
	return Push(&mResponseQueue,json);
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

