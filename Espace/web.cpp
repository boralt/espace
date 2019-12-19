
#include <cstdio>
#include <cstring>
#include <string>
#include "web.h"

static int event_handler(sb_Event *ev)
{
	WebServer *ws = (WebServer*)ev->udata;
	return ws->HandleRequest(ev);
}

void *web_server_thread(void *arg)
{
	((WebServer*)arg)->Run();
	return NULL;
}

void WebServer::Run()
{
	printf("Web server running on localhost:%s\n",mOptions.port);
	while (!mStopped)
	{
		sb_poll_server(mServer, 1000);
	}
}

bool WebServer::Start()
{
	if(pthread_create(&mTid, NULL, web_server_thread, this))
	{
		fprintf(stderr, "Error creating thread\n");
		return false;
	}

	return true;
}

void WebServer::Stop()
{
	mStopped=true;

	if(pthread_join(mTid, NULL))
	{
		fprintf(stderr, "Error stopping web server\n");
	}
	else
	{
		printf("Web server stopped\n");
	}
}

WebServer::~WebServer()
{
}

WebServer::WebServer(const char *port)
{
	mCalled  = 0;
	mStopped = false;
	memset(&mOptions, 0, sizeof(mOptions));
	mOptions.port    = port;
	mOptions.handler = event_handler;
	mOptions.udata   = this;

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
		printf("WebRequest: %s - %s %s\n", e->address, e->method, e->path);
		sb_send_status(e->stream, 200, "OK");
		sb_send_header(e->stream, "Content-Type", "text/plain");
		sb_writef(e->stream, "Espace simulator %d\n\n",mCalled);
		sb_writef(e->stream,mDataBuffer.c_str());
	}
	return SB_RES_OK;
}

void WebServer::SetDataBuffer(std::string data)
{
	mDataBuffer="";
}

void WebServer::AppendDataBuffer(std::string data)
{
	mDataBuffer += data;
}

