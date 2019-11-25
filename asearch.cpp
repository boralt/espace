

#include <stdio.h>

#define NUM_CHANNELS = 4
#define NUM_TRAFFIC_CLASSES = 8
#define NUM_FEC = 3

// channel 0 is unallocated

int LofC[NUM_CHANNELS] = {2000, 100,200,300};
int JofC[NUM_CHANNELS] = {600,30,10,40};
int BoC[NUM_CHANNELS] = {9000000, 10000, 20000, 40000 };
int DoC[NUM_CHANNELS] = {1000, 1, 2, 3};

int FecMult[NUM_FEC] = { 100, 110, 150};
int FecDiv[NUM_FEC] = { 1, 2, 3 };
   
#define FEC_DIVIDER = 100

   
// traffic requirements
int Treq[NUM_TRAFFIC_CLASSES] = {
   5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000
};

int tcJitterCost[NUM_TRAFFIC_CLASSES] =
{
   10,9,8,7,6,5,4,3,2
};


int tcLatencyCost[NUM_TRAFFIC_CLASSES] =
{

   10,9,8,7,6,5,4,3,2
}

int tcDropCost[tNUM_TRAFFIC_CLASSES] =
{
   10,9,8,7,6,5,4,3,2
}


// latency
int L(int channel)
{
   return LofC[channel];
}

int L(int channel, int fec)
{
   return LofC[channel];
}


// jitter
int J(int channel)
{
   return JofC[channel]; 
}

// drop
int D(int channel)
{
   return DofC[channel]; 
}

// bw
int B(int channel)
{
   return BofC[channel]; 
}


class  T
{
public:

   T()
   {
      memset(bc, 0, sizeof(bc));
      tc = 0;
   }
   
   void init(int nTotalBw, int _tc)
   {
      tc = _tc;
      memset(bc, 0, sizeof(bc));
      bc[0][0] = nTotalBw;
      drop = 0;
      latency = 0;
      jitter = 0;
      cost = 0;
      
      CalcCost();
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

      b[ch][fec] += chunk;
      bc[0][0] -= chunk;
      CalcCost(true);

   }
   
   int B(int c)
   {
      int nTotal;
      if(nTotal)
         return nTotal;

      for(int f = 0; f < NUM_FEC; f++)
      {
         nTotal += bc[c][f] * FecMult[f]/FEC_DIVIDER;
      }

      return nTotal;
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
      
      cost = jitter*tcJitterCost[tc] + latency*tcLatencyCost[tc] + drop*tcDropCost[tc];
      return cost;
   }


   int CalcDrop()
   {
      if (drop)
         return drop;

      drop = 0;

      if (bc[0][0])
         drop += bc[0][0];
      
      for (c=1; c<NUM_CHANNELS; c++)
      {
         for (f=0; f < NUM_FEC; f++)
         {
            if(bc[c][f])
            {
               int d = D(c);
               d /= FecDiv[f];
               if (d > 0)
                  drop += (bc[c][f] / 1000)*d;
            }
                     
         }
      }
      return drop;
   }

      

   
   int CalcLatency()
   {
      if (latency)
         return latency;

      int maxLatency = 0;
      
      for (c=0; c<NUM_CHANNELS; c++)
      {
         for (f=0; f < NUM_FEC; f++)
         {
            if(bc[c][f])
            {
               int l = L(c);
               int d = D(c);
               d /= FecDiv[f];
               if (d > 0)
                  l *= 2;
            }
            if (maxLatency < l)
               maxLatency = l;
         }
      }
      latency = maxLatency;
      return latency;
   }

   int CalcJitter()
   {
      if (jitter)
         return jitter;

      int maxLatency = 0;
      int minLatency = 0;
      int jitterOnMax = 0;
      int jitterOnMin = 0;
      
      for (c=0; c<NUM_CHANNELS; c++)
      {
         for (f=0; f < NUM_FEC; f++)
         {
            if(bc[c][f])
            {
               int l = L(c);
               int d = D(c);
               d /= FecDiv[f];
               if (d > 0)
                  l *= 2;
            }
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

      jitter = maxLatency - minLatency + (jitterOnMin + jitterOnMax)/2;
      
      return jitter;
   }

   
   
   int bc[NUM_CHANNELS][NUM_FEC];    // bandwidth per channel
   int cost;
   int tc;
   int latency;
   int jitter;
   int drop;
};

class Node
{
public:
   Node()
   {
      cost = 0;
      for(t = 0; t < NUM_TRAFFIC_CLASSES; t++)
      {
         tcs[t].Init(TReq[t], t);
      }
   }

   int tc GetUncomplited()
   {
      for(t=0;t < NUM_TRAFFIC_CLASSES; t++)
      {
         if (!tcs[t].IsAllAllocated())
            return t;
      }
      return -1;
   }


   void AllocateChunk(int tc, int chunk,  int ch, int fec)
   {
      tcs[tc].AllocateChunk(chunk, ch, fec);
   }

   int GetCost()
   {
      if(cost)
         return cost;
      
      int cost = 0;
      for(t=0;t < NUM_TRAFFIC_CLASSES; t++)
      {
         cost += tcs[t].CalcCost(); 
      }
      
      return cost;
   }
   
   T tcs[NUM_TRAFFIC_CLASSES];
   int cost = 0;

};


// latency of Traffic
int LC(T t)
{
   int maxL = 0;
   for (int c=0; c<NUM_CHANNELS; c++)
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
   int nChannels++;
   for (int c=0; c<NUM_CHANNELS; c++)
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
   for (int c=0; c<NUM_CHANNELS; c++)
   {
      if( t.B(c))
      {
         int l = L(c);
         int j = J(c);
         if (j > maxJ)
            maxJ = j;
         if (minL =0 || minL > l)
            minL = l;
         if (maxL < l)
            maxL = l;
      }
   }

   return maxL-minL + maxJ;;
}

class Node
{
public Node();


};







