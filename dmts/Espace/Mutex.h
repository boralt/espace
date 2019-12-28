
#pragma once

#if defined(_WIN32)

//TODO: need win locks!!!!

class Mutex
{
public:
	Mutex()
	{
	}
	~Mutex()
	{
	}

	void Lock()
	{
	}

   void Unlock()
	{
	}

private:

};

#else

#include <pthread.h>

class Mutex
{
public:
	Mutex()
	{
		pthread_mutex_init(&mMutex, NULL);
	}
	~Mutex()
	{
	}

	void Lock()
	{
		pthread_mutex_lock(&mMutex);
	}

	void Unlock()
	{
		pthread_mutex_unlock(&mMutex);
	}

private:
	pthread_mutex_t mMutex;
};

#endif

