
#include <cstdio>
#include <cstring>
#include <string>

#include "Thread.h"

#if defined(_WIN32)
DWORD thread_cb(LPVOID lpParam)
{
	((Thread*)lpParam)->Run();
	return 0;
}
#else
void *thread_cb(void *arg)
{
	((Thread*)arg)->Run();
	return NULL;
}
#endif


Thread::Thread()
{
	mStop=false;
}

Thread::~Thread()
{

}

bool Thread::Start()
{
#if !defined(_WIN32)
	if(pthread_create(&mTid, NULL, thread_cb, this))
	{
		fprintf(stderr, "Error creating thread\n");
		return false;
	}
#else
	CreateThread(
		NULL,                   // default security attributes
		0,                      // use default stack size
		thread_cb,       // thread function name
		this,          // argument to thread function
		0,                      // use default creation flags
		NULL);   // returns the thread identifier
#endif
	return true;
}

void Thread::Stop()
{
	mStop=true;

#if !defined _WIN32
	if(pthread_join(mTid, NULL))
#else
		if(!TerminateThread(mTid, 0))
#endif
	{
		fprintf(stderr, "Error stopping web server\n");
	}
	else
	{
		printf("Web server stopped\n");
	}
}

bool Thread::IsStop()
{
	return mStop;
}

void Thread::Lock()
{
	mMutex.Lock();
}

void Thread::Unlock()
{
	mMutex.Unlock();
}