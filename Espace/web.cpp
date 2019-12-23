
#include <cstdio>
#include <cstring>
#include <string>
#include <iostream>
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
		sb_poll_server(mServer, 1000);
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
			sb_writef(e->stream, "Espace Simulator: %s\n\n",ctime(&now));
			sb_writef(e->stream,mDataBuffer.c_str());
		}
		else // using message queue
		{
			sb_send_header(e->stream, "Content-Type", "text/json");
			sb_send_status(e->stream, 200, "OK");
			if (!strncmp(e->method,"POST",4) && e->content)
			{
				// add to worker queue
				mWq->RequestAdd(e->content);
			}
			else
			{
				std::string json;
				if (mWq->ResponseRemove(json,10))
				{
					//std::cout << json << std::endl;
					sb_writef(e->stream,json.c_str());
				}
				else
				{
					// no data
					sb_writef(e->stream,"{}");
				}
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
}

