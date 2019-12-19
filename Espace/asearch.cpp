
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <stack>
#include <unordered_set>
#include <string>

#include "run_config.h"

using namespace std;

RunConfig cfg;

std::unordered_set<std::string> visited; 

#if 0

#define cfg.num_channels  4
#define cfg.num_traffic_classes  8
#define cfg.num_fec  3

// channel 0 is unallocated

int LofC[cfg.num_channels] = {2000, 100,200,300};
int JofC[cfg.num_channels] = {600,30,10,40};
int BoC[cfg.num_channels] = {9000000, 10000, 20000, 40000 };
int DoC[cfg.num_channels] = {1000, 1, 2, 3};

int FecMult[cfg.num_fec] = { 100, 110, 150};
int FecDiv[cfg.num_fec] = { 1, 2, 3 };

#endif


#define FEC_DIVIDER  100

int min_cost = 0;
int recent_cost = 0;
int leafs_reached = 0;
int visited_ignored = 0;
int pruned = 0;

class Node;
Node *pMinCostNode = 0;

#if 0
// traffic requirements
int Treq[cfg.num_traffic_classes] = {
   5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000
};

int tcJitterCost[cfg.num_traffic_classes] =
{
   9,8,7,6,5,4,3,2
};


int tcLatencyCost[cfg.num_traffic_classes] =
{

   9,8,7,6,5,4,3,2
};

int tcDropCost[cfg.num_traffic_classes] =
{
   9,8,7,6,5,4,3,2
};

int try_chunk = 1000;
#endif
   
// latency
int L(int channel)
{
   return cfg.LofC[channel];
}

int L(int channel, int fec)
{
   return cfg.LofC[channel];
}


// jitter
int J(int channel)
{
   return cfg.JofC[channel];
}

// drop
int D(int channel)
{
   return cfg.DoC[channel];
}

// bw
int B(int channel)
{
   return cfg.BoC[channel];
}


class  T
{
public:

   T()
   {
          
      //memset(bc, 0, sizeof(bc));
	   for (int ch = 0; ch < cfg.num_channels; ch++)
	   {
		   bc.push_back(vector<int>(cfg.num_fec, 0));
	   }
			

	  //std::fill(bc[0].begin(), bc[0].end(), 0);
	  //std::fill(bc.begin(), bc.end(), bc[0]);
      tc = 0;
   }
   
   void init(int nTotalBw, int _tc)
   {
      tc = _tc;
      // memset(bc, 0, sizeof(bc));
      bc[0][0] = nTotalBw;
      drop = 0;
      latency = 0;
      jitter = 0;
      cost = 0;
	  nTotal = 0;
      
      CalcCost(false);
   }

    std::string ToStr()
    {
        std::string s;
        char sz[100];
        for(int ch=0; ch < cfg.num_channels; ch++)
        {
            sprintf(sz, "%d[", ch);
            s+= sz;
            for(int f=0; f < cfg.num_fec; f++)
            {
                sprintf(sz, "%d:%d", f, bc[ch][f]);
                s+= sz;
            }
            s+="]";
        }
        return s;
    }

	std::string ToRepr()
	{
		char sz[100];
		std::string s;
		sprintf(sz, "====  TC %d === drop/lat/jit/cost %d %d %d %d\n", tc, drop, latency, jitter, cost);
		s += sz;
		s += "CH/FEC   ";
		for (int f = 0; f < cfg.num_fec; f++)
		{
			sprintf(sz, "    %d    ", f);
			s += sz;
		}


		s += "\n";
		for (int ch = 0; ch < cfg.num_channels; ch++)
		{
			sprintf(sz, "%d        ", ch);
			s += sz;
			for (int f = 0; f < cfg.num_fec; f++)
			{
				sprintf(sz, " %06d ", bc[ch][f]);
				s += sz;
			}
			s += "\n";
		}
		return s;
	}


   bool IsAllAllocated()
   {
      return bc[0][0] == 0;
   }

   void AllocateChunk(int chunk, int ch, int fec)
   {
      if (!bc[0][0])
         return; // nothing to do

      if (chunk > bc[0][0])
         chunk = bc[0][0];

      bc[ch][fec] += chunk;
      bc[0][0] -= chunk;
      // CalcCost(true);
	  cost = 0;
	  drop = 0;
	  jitter = 0;
	  latency = 0;
	  nTotal = 0;

   }

   

#
   int B(int c)
   {
      
   //   if(nTotal)
   //      return nTotal;

	  int n = 0;
      for(int f = 0; f < cfg.num_fec; f++)
      {
         n += bc[c][f] * cfg.FecMult[f]/FEC_DIVIDER;
      }

      return n;
   }


   int CalcHeristics()
   {
	   CalcLatency(3);
	   CalcJitter(3);
	   CalcDrop(3);	   
	   return jitter * cfg.tcJitterCost[tc] + latency * cfg.tcLatencyCost[tc] + drop * cfg.tcDropCost[tc];
   }
   
   int CalcCost(bool force)
   {
      if(force)
      {
         cost = 0;
         drop = 0;
         jitter = 0;
         latency = 0;
      }
      
      if (cost)
         return cost;
      
      CalcLatency();
      CalcJitter();
      CalcDrop();
      
      cost = jitter* cfg.tcJitterCost[tc] + latency* cfg.tcLatencyCost[tc] + drop* cfg.tcDropCost[tc];
      return cost;
   }


   int CalcDrop(bool fecOvrd = 0)
   {
      if (drop)
         return drop;

      drop = 0;

      if (bc[0][0])
         drop += bc[0][0];
      
      for (int c=1; c<cfg.num_channels; c++)
      {
         for (int f=0; f < cfg.num_fec; f++)
         {
            if(bc[c][f])
            {
               int d = D(c);
               d /= (fecOvrd ? fecOvrd : cfg.FecDiv[f]);
               if (d > 0)
                  drop += (bc[c][f] / 1000)*d;
            }
                     
         }
      }
      return drop;
   }

      

   
   int CalcLatency(bool fecOvrd=0)
   {
      if (latency)
         return latency;

      int maxLatency = 0;
      
      for (int c=0; c<cfg.num_channels; c++)
      {
         for (int f=0; f < cfg.num_fec; f++)
         {
            if(bc[c][f])
            {
               int l = L(c);
               int d = D(c);
               d /= (fecOvrd? fecOvrd: cfg.FecDiv[f]);
               if (d > 0)
                  l *= 2;
               if (maxLatency < l)
                  maxLatency = l;
            }
         }
      }
      latency = maxLatency;
      return latency;
   }

   int CalcJitter(bool fecOvrd = 0)
   {
      if (jitter)
         return jitter;

      int maxLatency = 0;
      int minLatency = 0;
      int jitterOnMax = 0;
      int jitterOnMin = 0;
      
      for (int c=0; c<cfg.num_channels; c++)
      {
         for (int f=0; f < cfg.num_fec; f++)
         {
            if(bc[c][f])
            {
               int l = L(c);
               int d = D(c);
               d /= (fecOvrd ? fecOvrd : cfg.FecDiv[f]);
               if (d > 0)
                  l *= 2;
               if (maxLatency < l)
               {
                  maxLatency = l;
                  jitterOnMax = J(c);
               }
               if (minLatency ==0 || minLatency > l)
               {
                  minLatency = l;
                  jitterOnMin = J(c);
               }
            }
         }
      }

      jitter = maxLatency - minLatency + (jitterOnMin + jitterOnMax)/2;
      
      return jitter;
   }

   
   
   vector < vector<int> > bc;    // bandwidth per channel
   int cost;
   int tc;
   int latency;
   int jitter;
   int drop;
   int nTotal;
};

class Node
{
public:
   Node()
   {
      cost = 0;
	  //tcs.resize(cfg.num_traffic_classes);
      for(int t = 0; t < cfg.num_traffic_classes; t++)
      {
		 tcs.push_back(T());
         tcs[t].init(cfg.Treq[t], t);
      }
      changed_ch = 0;
      changed_fec = 0;

   }


    std::string ToStr()
    {
        if(!save_str.empty())
            return save_str;

        std::string s;
        char sz[100];
        
        for(int t = 0; t < cfg.num_traffic_classes; t++)
        {
            sprintf(sz, "%d:{", t );
            s += sz;
            s += tcs[t].ToStr();
            s += "}";
        }
        save_str = s;
        return save_str;
    }

	std::string ToRepr()
	{
		std::string s;
		char sz[100];

		for (int t = 0; t < cfg.num_traffic_classes; t++)
		{
			s += tcs[t].ToRepr();
		}
		return s;
	}



    bool IsVisited()
    {
        return visited.count(ToStr()) > 0;
    }

    void SetVisited()
    {
        visited.insert(ToStr());
    }

   int GetUncomplited()
   {
      for(int t=0;t < cfg.num_traffic_classes; t++)
      {
         if (!tcs[t].IsAllAllocated())
            return t;
      }
      return -1;
   }

   int IsCompleted(int tc)
   {
	   return tcs[tc].IsAllAllocated();
   }

   Node *GetNextDescendent(Node *prevDescendent)
   {

      int prev_ch = prevDescendent->changed_ch;
      int prev_fec = prevDescendent->changed_fec;
      int prev_tc = prevDescendent->changed_tc;
      if(prev_fec < (cfg.num_fec-1))
      {
         Node *pNextNode = new Node(*this);
         pNextNode->AllocateChunk(prev_tc, cfg.try_chunk, prev_ch, prev_fec+1);
         return pNextNode;
      }
      else if( prev_ch < (cfg.num_channels-1))
      {
         Node *pNextNode = new Node(*this);
         pNextNode->AllocateChunk(prev_tc, cfg.try_chunk, prev_ch+1, 0);
         return pNextNode;
         
      }
      else if(prev_tc < (cfg.num_traffic_classes-1))
      {
         Node *pNextNode = new Node(*this);
         pNextNode->AllocateChunk(prev_tc+1, cfg.try_chunk, 1, 0);
         return pNextNode;
      }
      return 0;
      
   }

   int PopulateNeighbours(stack<Node *> &st)
   {

      int tc = GetUncomplited();
      int n = 0;
	  bool bHadPruned = 0;
      if (tc >=0)
      {
         // for(int ch = 1; ch < cfg.num_channels; ch++)
		  for (int ch = cfg.num_channels-1; ch>0; ch--)
         {
            if(ChFull(ch))
               continue;
            for(int fec = 0; fec < cfg.num_fec; fec++)
            {
               Node *pNode = new Node(*this);
               pNode->save_str = "";
               pNode->AllocateChunk(tc, cfg.try_chunk, ch, fec);

			   int her = pNode->CalcHeristic();
			   
			   if (min_cost > 0 && her > min_cost)
			   {
				   delete pNode;
				   pruned++;
			   }
			   else
			   {
				   st.push(pNode);
				   n++;
			   }
            }
         }
      }

	  // leaf node
	  if (n == 0 && !bHadPruned)
	  {
		  GetCost();
		  if (min_cost == 0 || cost < min_cost)
		  {
			  min_cost = cost;
			  if (pMinCostNode)
				  delete pMinCostNode;
			  pMinCostNode = new Node(*this);
		  }
		  if (recent_cost == 0 || cost < recent_cost)
		  {
				  recent_cost = cost;
		  }
	  }

      return n;
   }

   int CalcHeristic()
   {
	   Node heristicNode(*this);
	   int tc = heristicNode.GetUncomplited();
	   int n = 0;
	   int chMin = 1;


	   while (tc >= 0 && chMin < cfg.num_channels)
	   {
		  

		   for (int ch = chMin; ch < cfg.num_channels; )
		   {

			   if (heristicNode.ChFull(ch))
			   {
				   chMin = ch + 1;
				   ch += 1;
				   continue;
			   }
			   if (heristicNode.IsCompleted(tc))
			   {
				   break;
			   }

			   heristicNode.AllocateChunk(tc, cfg.try_chunk, ch, 0);

		   }
		   tc = heristicNode.GetUncomplited();
	   }


	   return heristicNode.SumHeristics();
   }

   int SumHeristics()
   {
	   int heristics = 0;
	   for (int t = 0; t < cfg.num_traffic_classes; t++)
	   {
		   heristics += tcs[t].CalcHeristics();
	   }
	   return heristics;

   }

   bool ChFull(int ch)
   {
      int chBw = 0;
      
      for(int tc=0; tc < cfg.num_traffic_classes; tc++)
      {
         chBw += tcs[tc].B(ch);
      }

      return chBw >= cfg.BoC[ch];
   }
   
   
   void AllocateChunk(int tc, int chunk,  int ch, int fec)
   {
      tcs[tc].AllocateChunk(chunk, ch, fec);
      changed_ch = ch;
      changed_fec = fec;
      changed_tc = tc;
      save_str = "";
   }

   int GetCost()
   {
      if(cost)
         return cost;
      
      cost = 0;
      for(int t=0;t < cfg.num_traffic_classes; t++)
      {
         cost += tcs[t].CalcCost(false); 
      }
      
      return cost;
   }
   
   vector<T> tcs;
   int cost;
   int changed_ch;
   int changed_fec;
   int changed_tc;
    //bool visited;
    std::string save_str;
	
   
};


// latency of Traffic
int LC(T t)
{
   int maxL = 0;
   for (int c=0; c<cfg.num_channels; c++)
   {
      int l = L(c);
      if (t.B(c))
      {
         if(l > maxL)
            maxL = l;
      }
   }
   return maxL;
}

//  Drop of traffic
int LD(T t)
{
   int totalD = 0;
   int nChannels=0;
   for (int c=0; c<cfg.num_channels; c++)
   {
      int d = D(c);
      if (t.B(c))
      {
         totalD += d;
         nChannels++;
      }
   }
   if (nChannels)
      return totalD/nChannels;
   return totalD;
}


// jitter of traffic
int JC(T t)
{
   int maxL = 0;
   int minL = 0;
   int maxJ = 0;
   for (int c=0; c<cfg.num_channels; c++)
   {
      if( t.B(c))
      {
         int l = L(c);
         int j = J(c);
         if (j > maxJ)
            maxJ = j;
         if (minL == 0 || minL > l)
            minL = l;
         if (maxL < l)
            maxL = l;
      }
   }

   return maxL-minL + maxJ;;
}

void Algorithm(RunConfig &_rc)
{
	cfg = _rc;
   Node *head = new Node;
   stack<Node *> st;
   st.push(head);
   int loop = 0;
   Node* pPrintedNode = 0;
#define BLEN 1024
   char buf[BLEN+1];
	int pos=0;

   while(!st.empty())
   {
      loop++;
      if(loop % 1000 == 0)
      {
			pos += snprintf(buf,BLEN,"Loop %d Size=%d cost=%d recent=%d leafes=%d visited=%zu ignored=%d pruned=%d\n",
								 loop, (int) st.size(), min_cost, recent_cost, leafs_reached, visited.size(), visited_ignored, pruned);
			if (pMinCostNode && pMinCostNode != pPrintedNode)
			{
				pPrintedNode = pMinCostNode;
				pos += snprintf(&buf[pos],BLEN-pos,"%s", pMinCostNode->ToRepr().c_str());
			}
			printf("%s\n",buf);
			_rc.ws->AppendDataBuffer(buf);
			pos=0;
			recent_cost = 0;
          
      }
      Node *pNext = st.top();
      st.pop();
      if (!pNext->IsVisited())
      {
          pNext->SetVisited();
         int newCount = pNext->PopulateNeighbours(st);
         if (newCount == 0)
             leafs_reached++;
         delete pNext;
      }
	  else
	  {
		  visited_ignored++;
	  }

   }
   printf("Loop %d Size=%d cost=%d recent=%d leafes=%d visited=%zu ignored=%d pruned=%d res=%s\n", loop, (int)st.size(), min_cost, recent_cost, leafs_reached, visited.size(), visited_ignored, pruned, pMinCostNode->ToStr().c_str());
   printf("%s", pMinCostNode->ToRepr().c_str());
}
#if 0
#if !defined(_WIN32)
int main(int, char **)
{
   Algorithm();
   printf("Cost = %d", min_cost);
   return 0;
}
#endif
#endif









