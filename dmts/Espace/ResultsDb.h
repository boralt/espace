
#pragma once

#include "Thread.h"
#include "Mutex.h"

#include <deque>
#include <string>
#include <time.h>

class ResultsDb
{
public:
	ResultsDb(int max_size=4000)
	{
		mMaxSize=max_size;
	}
	~ResultsDb()
	{
	}

	void Add(std::string json, std::string sess_id, time_t start_ts)
	{
		if (!start_ts)
		{
			start_ts = time(0);
		}

		mMutex.Lock();
		mTimestamps.push_back(start_ts);
		mSessionId.push_back(sess_id);
		mJson.push_back(json);

		if (mTimestamps.size()>mMaxSize)
		{
			// remove oldest
			mTimestamps.pop_back();
			mSessionId.pop_back();
			mJson.pop_back();
		}

		mMutex.Unlock();
	}

	std::string Find(time_t start_ts, time_t end_ts, std::string sess_id, int limit)
	{
		std::string json;
		int x,c=0;

		if (end_ts==0)
		{
			end_ts=time(0);
		}

		// brute force, but ok for now
		// TODO: start_ts should be binary search
		json = "{\"search_results\":[";
		mMutex.Lock();
		for (x=0;x<mTimestamps.size();x++)
		{
			if (mTimestamps[x] >= start_ts && mTimestamps[x] <= end_ts && sess_id == mSessionId[x])
			{
				c++;
				json += mJson[x];
				json += ",";
				if (limit && c>=limit)
				{
					break;
				}
			}
		}
		mMutex.Unlock();
		if (c)
		{
			json.pop_back(); // remove trailing ","
		}
		json += "],";
		json += "\"num_results\":"+std::to_string(c)+"}";
		printf("DB Search found %d entries out of %lu\n",c,mTimestamps.size());
		return json;
	}

private:
	int   mMaxSize;
	Mutex mMutex;
	std::deque<time_t>      mTimestamps;
	std::deque<std::string> mSessionId;
	std::deque<std::string> mJson;
};