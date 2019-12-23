
#include "WorkerQueue.h"

WorkerQueue::WorkerQueue()
{

}

WorkerQueue::~WorkerQueue()
{

}

int WorkerQueue::RequestQueueSize()
{
	int sz=0;
	Lock();
	sz=mRequestQueue.size();
	Unlock();
	return sz;
}

bool WorkerQueue::RequestRemove(std::string &json, int msecs)
{
	bool rc=false;

	while (RequestQueueSize() == 0)
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
	if (!mRequestQueue.empty())
	{
		json = mRequestQueue.front();
		mRequestQueue.pop();
		rc=true;
	}
	Unlock();
	return rc;
}


void WorkerQueue::RequestAdd(std::string json)
{
	Lock();
	mRequestQueue.push(json);
	Unlock();
}


int WorkerQueue::ResponseQueueSize()
{
	int sz=0;
	Lock();
	sz=mResponseQueue.size();
	Unlock();
	return sz;
}

bool WorkerQueue::ResponseRemove(std::string &json, int msecs)
{
	bool rc=false;

	while (ResponseQueueSize() == 0)
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
	if (!mResponseQueue.empty())
	{
		json = mResponseQueue.front();
		mResponseQueue.pop();
		rc=true;
	}
	Unlock();
	return rc;
}


void WorkerQueue::ResponseAdd(std::string json)
{
	Lock();
	mResponseQueue.push(json);
	Unlock();
}


void WorkerQueue::Run()
{
	std::string json;

	while (!IsStop())
	{
		if (RequestRemove(json, 1000))
		{
			DoWork(json);
		}
	}
}

