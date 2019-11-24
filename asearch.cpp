

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
int T[NUM_TRAFFIC_CLASSES] = {
   5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000
};

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
   T(int nTotalBw, int _tc) : tc(_tc) {
      memset(bc, 0, sizeof(bc));
      bc[0][0] = nTotalBw;
      drop = 
      
      CalcCost();
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

   
   
   int CalcCost()
   {
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
                  drop += (bc[c][f] / 1000)*d
                     
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







