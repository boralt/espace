
#pragma once

#include "Mutex.h"

#if !defined(_WIN32)
#include <pthread.h>
#include <unistd.h>
#define MSLEEP(ms)  usleep(ms*1000)
#else
#include <windows.h>
#define MSLEEP(ms)  Sleep(ms)
#endif

#define LT printf("%s:%s():%d\n",__FILE__,__func__,__LINE__)

class Thread
{
public:
	Thread();
	~Thread();

	bool Start();
	void Stop();

	void Lock();
	void Unlock();

	// internal callback
	virtual void Run()=0;

protected:
	bool IsStop();

private:
	bool mStop;
	Mutex mMutex;
#if !defined _WIN32
	pthread_t   mTid;
#else
	HANDLE mTid;
#endif
};