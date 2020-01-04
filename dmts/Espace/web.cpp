
#include <cstdio>
#include <cstring>
#include <string>
#include <iostream>
#include <ctime>
#include "web.h"

static int event_handler(sb_Event *ev)
{
	WebServer *ws = (WebServer*)ev->udata;
	return ws->HandleRequest(ev);
}


#if defined(_WIN32)
DWORD web_server_thread(LPVOID lpParam)
{
	((WebServer*)lpParam)->Run();
	return 0;
}
#else
void *web_server_thread(void *arg)
{
	((WebServer*)arg)->Run();
	return NULL;
}
#endif


void WebServer::Run()
{
	printf("Web server running on localhost:%s\n",mOptions.port);
	while (!IsStop())
	{
		sb_poll_server(mServer, 100);
	}
}

WebServer::~WebServer()
{
}

WebServer::WebServer(const char *port, WorkerQueue *wq)
{
	Init(port);
	if (wq)
	{
		mWq=wq;
	}
	else
	{
		mUseDataBuffer=true;
	}
	mMaxDbLen = (1024*1024);
}

void WebServer::Init(const char* port)
{
	mCalled  = 0;
	memset(&mOptions, 0, sizeof(mOptions));
	mOptions.port    = port;
	mOptions.handler = event_handler;
	mOptions.udata   = this;
	mWq = NULL;
	mUseDataBuffer=false;
	mServer = sb_new_server(&mOptions);

	if (!mServer)
	{
		fprintf(stderr, "failed to initialize server\n");
	}
}

// curl -d "@config.json" -H 'Expect:' -X POST http://localhost:7777
// curl  -X GET "http://localhost:7777/?session_id=1234&limit=20"

int WebServer::HandleRequest(sb_Event *e)
{
	mCalled++;
	if (e->type == SB_EV_REQUEST)
	{
		// TODO: clean this up
		if (mUseDataBuffer)
		{
			time_t now;
			time(&now);
			// dump data buffer
			sb_send_header(e->stream, "Content-Type", "text/plain");
			sb_send_status(e->stream, 200, "OK");
			sb_writef(e->stream, "--- Espace Simulator Debug Server ---\nDataBufferLength: %d bytes of %d max bytes (truncates oldest)\n%s",
						 mDataBuffer.length(),mMaxDbLen,ctime(&now));
			sb_writef(e->stream,mDataBuffer.c_str());
		}
		else // using message queue
		{
			//sb_send_header(e->stream, "Content-Type", "text/json");
			sb_send_status(e->stream, 200, "OK");
			if (!strncmp(e->method,"POST",4) && e->content)
			{
				// add to worker queue
				mWq->RequestPush(e->content);
			}
			else // GET
			{
				int c=0,limit=0;
				std::string json,json2,result;

				char sidstr[64]={0};
				char limitstr[16]={0};
				sb_get_var(e->stream,"session_id",sidstr,63);
				sb_get_var(e->stream,"limit",limitstr,15);
				limit = atoi(limitstr);

				json = "\"results\":[";
				while (mWq->ResponsePeek(json2, 0, sidstr))
				{
					json+=json2;
					json += ",";
					c++;
					mWq->ResponsePop(sidstr);
					if (limit && c >= limit)
					{
						break;
					}
				}
				if (c)
				{
					json.pop_back(); // remove trailing ","
				}
				json+="]}";
				result="{\"num_results\":"+std::to_string(c)+",";
				result+="\"num_pending\":"+std::to_string(mWq->ResponseQueueSize(sidstr))+",";
				result+="\"total_requests\":"+std::to_string(mWq->TotalRequests())+",";
				result+=json;
				sb_writef(e->stream, result.c_str());
			}
		}
	}
	return SB_RES_OK;
}

void WebServer::SetDataBuffer(std::string data)
{
	mDataBuffer=data;
}

void WebServer::AppendDataBuffer(std::string data)
{
	mDataBuffer += data;
	if (mDataBuffer.length() > mMaxDbLen)
	{
		mDataBuffer.erase(0,mDataBuffer.length() - mMaxDbLen);
	}
}

void WebServer::SetDataBufferMaxLen(int len)
{
	if (len<512)
	{
		len=512;
	}
	mMaxDbLen=len;
}

