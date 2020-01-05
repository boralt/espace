
#include <stdlib.h>
#include <string.h>
#include <stdio.h>
#include <stack>
#include <unordered_set>
#include <set>
#include <string>

#include "run_config.h"

using namespace std;

bool heristic_debug = false;

class HashCollector
{
public:
    HashCollector()
    {
        prime = 1099511628211UL;
        hash = 14695981039346656037UL;
    }

    void Add(uint8_t val)
    {
        hash = hash ^ val;
        hash = hash * prime;
    }

    void Add(int val)
    {
        uint8_t octet;
        for (int i = 0; i < 4; i++)
        {
            octet = (uint8_t)val % 256;
            Add(octet);
            val /= 256;
        }
    }

    void Add(unsigned int val)
    {
        uint8_t octet;
        for (int i = 0; i < 4; i++)
        {
            octet = (uint8_t)val % 256;
            Add(octet);
            val /= 256;
        }
    }


    uint64_t hash;
    uint64_t prime;

};


// TODO: cfg should not be global
RunConfig cfg;

// TODO: should not be global
std::unordered_set<std::string> visited;
std::set<uint64_t> visited_hashes;

#if 0

#define cfg.num_channels  4
#define cfg.num_traffic_classes  8
#define cfg.num_fec  3

// channel 0 is unallocated

int LofC[cfg.num_channels] = { 2000, 100,200,300 };
int JofC[cfg.num_channels] = { 600,30,10,40 };
int BoC[cfg.num_channels] = { 9000000, 10000, 20000, 40000 };
int DoC[cfg.num_channels] = { 1000, 1, 2, 3 };

int FecMult[cfg.num_fec] = { 100, 110, 150 };
int FecDiv[cfg.num_fec] = { 1, 2, 3 };

#endif


#define FEC_DIVIDER  100

int min_cost = 0;
int recent_cost = 0;
int leafs_reached = 0;
int visited_ignored = 0;
int pruned = 0;

class Node;
Node* pMinCostNode = 0;

// Init global data so algorithm can be run multiple times
// TODO: this should all be in a class
void Init(RunConfig& _rc)
{
    cfg = _rc;
    min_cost = 0; // need this cleared for re-entry
    recent_cost = 0;
    leafs_reached = 0;
    visited_ignored = 0;
    pruned = 0;
    pMinCostNode = NULL;
    visited.clear();
    visited_hashes.clear();
}

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

    T() :
        drop(0),
        latency(0),
        jitter(0),
        cost(0),
        nTotal(0)
    {

        //memset(bc, 0, sizeof(bc));
        for (unsigned int ch = 0; ch < cfg.num_channels; ch++)
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
        for (unsigned int ch = 0; ch < cfg.num_channels; ch++)
        {
            sprintf(sz, "%d[", ch);
            s += sz;
            for (unsigned int f = 0; f < cfg.num_fec; f++)
            {
                sprintf(sz, "%d:%d", f, bc[ch][f]);
                s += sz;
            }
            s += "]";
        }
        return s;
    }

    void
        ToHash(HashCollector& hc)
    {
        for (unsigned int ch = 0; ch < cfg.num_channels; ch++)
        {
            for (unsigned int f = 0; f < cfg.num_fec; f++)
            {
                hc.Add(bc[ch][f]);
            }

        }

    }

    std::string ToRepr()
    {
        char sz[100];
        std::string s;
        sprintf(sz, "====  TC %d === drop/lat/jit/cost %d %d %d %d\n", tc, drop, latency, jitter, cost);
        s += sz;
        s += "CH/FEC   ";
        for (unsigned int f = 0; f < cfg.num_fec; f++)
        {
            sprintf(sz, "    %d    ", f);
            s += sz;
        }


        s += "\n";
        for (unsigned int ch = 0; ch < cfg.num_channels; ch++)
        {
            sprintf(sz, "%d        ", ch);
            s += sz;
            for (unsigned int f = 0; f < cfg.num_fec; f++)
            {
                sprintf(sz, " %06d ", bc[ch][f]);
                s += sz;
            }
            s += "\n";
        }
        return s;
    }

    std::string ToReprJson()
    {
        //char sz[100];
        std::string s;

        s = "[";
        for (unsigned int ch = 0; ch < cfg.num_channels; ch++)
        {
            if (ch > 0)
            {
                s += ",";
            }
            s += "{\"chan_per_fec_bw\":[";
            for (unsigned int f = 0; f < cfg.num_fec; f++)
            {
                if (f > 0)
                {
                    s += ",";
                }
                s += std::to_string(bc[ch][f]);
            }
            s += "]}";
        }
        s += "]";
        return s;
    }
#if 0 // much more verbose version
    std::string ToReprJson()
    {
        char sz[100];
        std::string s;

        //{"channel":0,"fec":0,"bw":12000}
        s = "[";
        for (int ch = 0; ch < cfg.num_channels; ch++)
        {
            if (ch > 0)
            {
                s += ",";
            }
            for (int f = 0; f < cfg.num_fec; f++)
            {
                if (f > 0)
                {
                    s += ",";
                }
                s += "{\"channel\":" + std::to_string(ch) + ",\"fec\":" + std::to_string(f) + ",\"bw\":" + std::to_string(bc[ch][f]) + "}";
            }
        }
        s += "]";
        return s;
    }
#endif

    bool IsAllAllocated()
    {
        return bc[0][0] == 0;
    }

    int LeftUnallocated()
    {
        return bc[0][0];
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

    int TestHeristicChunk(int ch, int chunk)
    {
        int d = D(ch);
        
        d /= cfg.FecDiv[2];
        int _drop = (chunk / 1000) * d;
        int _latency = L(ch);
        if (d > 0)
        {
            _latency *= 2;
        }

        return _latency * cfg.tcLatencyCost[tc] + _drop * cfg.tcDropCost[tc];
        
    }

    void DeAllocateChunk(int chunk, int ch, int fec)
    {
        if (!bc[ch][fec])
            return; // nothing to do

        if (chunk > bc[ch][fec])
            chunk = bc[ch][fec];

        bc[0][0] += chunk;
        bc[ch][fec] -= chunk;

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
        for (unsigned int f = 0; f < cfg.num_fec; f++)
        {
            n += bc[c][f] * cfg.FecMult[f] / FEC_DIVIDER;
        }

        return n;
    }


    int CalcHeristics()
    {
        CalcLatency(3);
        CalcJitter(3);
        CalcDrop(3);
        if (heristic_debug)
        {
            cfg.WriteDebug(ToRepr());
        }
        return jitter * cfg.tcJitterCost[tc] + latency * cfg.tcLatencyCost[tc] + drop * cfg.tcDropCost[tc];
    }

    int CalcCost(bool force)
    {
        if (force)
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

        cost = jitter * cfg.tcJitterCost[tc] + latency * cfg.tcLatencyCost[tc] + drop * cfg.tcDropCost[tc];
        return cost;
    }


    int CalcDrop(int fecOvrd = 0)
    {
        if (drop)
            return drop;

        drop = 0;

        if (bc[0][0])
            drop += bc[0][0];

        for (unsigned int c = 1; c < cfg.num_channels; c++)
        {
            for (unsigned int f = 0; f < cfg.num_fec; f++)
            {
                if (bc[c][f])
                {
                    int d = D(c);
                    d /= (fecOvrd ? fecOvrd : cfg.FecDiv[f]);
                    if (d > 0)
                        drop += (bc[c][f] / 1000) * d;
                }

            }
        }
        return drop;
    }




    int CalcLatency(int fecOvrd = 0)
    {
        if (latency)
            return latency;

        int maxLatency = 0;

        for (unsigned int c = 1; c < cfg.num_channels; c++)
        {
            for (unsigned int f = 0; f < cfg.num_fec; f++)
            {
                if (bc[c][f])
                {
                    int l = L(c);
                    int d = D(c);
                    d /= (fecOvrd ? fecOvrd : cfg.FecDiv[f]);
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

    int CalcJitter(int fecOvrd = 0)
    {
        if (jitter)
            return jitter;

        int maxLatency = 0;
        int minLatency = 0;
        int jitterOnMax = 0;
        int jitterOnMin = 0;

        for (unsigned int c = 1; c < cfg.num_channels; c++)
        {
            for (unsigned int f = 0; f < cfg.num_fec; f++)
            {
                if (bc[c][f])
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
                    if (minLatency == 0 || minLatency > l)
                    {
                        minLatency = l;
                        jitterOnMin = J(c);
                    }
                }
            }
        }

        jitter = maxLatency - minLatency + (jitterOnMin + jitterOnMax) / 2;

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
    Node() :
        changed_fec(0),
        changed_tc(0),
        my_hash(0)
    {
        cost = 0;
        //tcs.resize(cfg.num_traffic_classes);
        for (unsigned int t = 0; t < cfg.num_traffic_classes; t++)
        {
            tcs.push_back(T());
            tcs[t].init(cfg.Treq[t], t);
        }

    }


    std::string ToStr()
    {
        if (!save_str.empty())
            return save_str;

        std::string s;
        char sz[100];

        for (unsigned int t = 0; t < cfg.num_traffic_classes; t++)
        {
            sprintf(sz, "%d:{", t);
            s += sz;
            s += tcs[t].ToStr();
            s += "}";
        }
        save_str = s;
        return save_str;
    }

    uint64_t ToHash()
    {
        if (my_hash)
            return my_hash;

        HashCollector hc;
        for (unsigned int t = 0; t < cfg.num_traffic_classes; t++)
        {
            tcs[t].ToHash(hc);
        }
        my_hash = hc.hash;
        return my_hash;
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


    std::string ToReprJson()
    {
        std::string s;
        // char sz[100];

        s = "{\"values\":[";
        for (unsigned int t = 0; t < cfg.num_traffic_classes; t++)
        {
            if (t > 0)
            {
                s += ",";
            }
            s += "{\"traffic_class\":" + std::to_string(t) + ",\"values\":";
            s += tcs[t].ToReprJson();
            s += "}";
        }
        s += "]}";
        return s;
    }



    bool IsVisited()
    {
#if STRONG_TRACKING
        return visited.count(ToStr()) > 0;
#else
        return visited_hashes.count(ToHash());
#endif
    }

    void SetVisited()
    {
#if STRONG_TRACKING      
        visited.insert(ToStr());
#else
        visited_hashes.insert(ToHash());
#endif
    }

    int GetUncomplited()
    {
        for (unsigned int t = 0; t < cfg.num_traffic_classes; t++)
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

    Node* GetNextDescendent(Node* prevDescendent)
    {

        unsigned int prev_ch = prevDescendent->changed_ch;
        unsigned int prev_fec = prevDescendent->changed_fec;
        unsigned int prev_tc = prevDescendent->changed_tc;
        if (prev_fec < (cfg.num_fec - 1))
        {
            Node* pNextNode = new Node(*this);
            pNextNode->AllocateChunk(prev_tc, cfg.try_chunk, prev_ch, prev_fec + 1);
            return pNextNode;
        }
        else if (prev_ch < (cfg.num_channels - 1))
        {
            Node* pNextNode = new Node(*this);
            pNextNode->AllocateChunk(prev_tc, cfg.try_chunk, prev_ch + 1, 0);
            return pNextNode;

        }
        else if (prev_tc < (cfg.num_traffic_classes - 1))
        {
            Node* pNextNode = new Node(*this);
            pNextNode->AllocateChunk(prev_tc + 1, cfg.try_chunk, 1, 0);
            return pNextNode;
        }
        return 0;

    }

    int PopulateNeighbours(stack<Node*>& st)
    {
        int tc = GetUncomplited();
        int n = 0;
        bool bHadPruned = 0;
        if (tc >= 0)
        {
            // for(int ch = 1; ch < cfg.num_channels; ch++)
            for (int ch = cfg.num_channels - 1; ch > 0; ch--)
            {
                if (ChFull(ch))
                    continue;
                for (unsigned int fec = 0; fec < cfg.num_fec; fec++)
                {
                    Node* pNode = new Node(*this);
                    pNode->save_str = "";

                    int try_chunk = cfg.try_chunk;
                    try_chunk = ((cfg.Treq[tc] / 3 + cfg.try_chunk -1) / cfg.try_chunk) * cfg.try_chunk;
                    if (try_chunk > tcs[tc].LeftUnallocated())
                        try_chunk = tcs[tc].LeftUnallocated();
                    

                    pNode->AllocateChunk(tc, try_chunk, ch, fec);

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

    int CalcHeristic2()
    {
        Node heristicNode(*this);
        int tc = heristicNode.GetUncomplited();
        int n = 0;
        unsigned int chMin = 1;


        while (tc >= 0 && chMin < cfg.num_channels)
        {


            for (unsigned int ch = chMin; ch < cfg.num_channels; )
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

    int CalcHeristic()
    {
        Node heristicNode(*this);
        int tc = heristicNode.GetUncomplited();
        int n = 0;
        unsigned int chMin = 1;

        vector<bool> consumed_channels(cfg.num_channels, false);
        vector<bool> consumed_traffic(cfg.num_traffic_classes, false);

        vector<int> max_cost(cfg.num_traffic_classes, 0);
        vector<int> min_cost(cfg.num_traffic_classes, 0);
        vector<int> min_cost_ch(cfg.num_traffic_classes, 0);
   
        while (true)
        {
            std::fill(min_cost.begin(), min_cost.end(), 0);
            std::fill(max_cost.begin(), max_cost.end(), 0);
            std::fill(min_cost_ch.begin(), min_cost_ch.end(), 0);

            int lowest_tc = -1;
            int lowest_ch = -1;
            int highest_cost_dif = -1;


            for (int tc = 0; tc < cfg.num_traffic_classes; tc++)
            {
                if (consumed_traffic[tc])
                {
                    continue;
                }

                if (heristicNode.IsCompleted(tc))
                {
                    consumed_traffic[tc] = true;
                    continue;
                }

                for (unsigned int ch = 1; ch < cfg.num_channels; ch++)
                {
                    if (heristicNode.ChFull(ch))
                    {
                        consumed_channels[ch] = true;
                        continue;
                    }

                    int chunk_cost = heristicNode.TestHeristicChunk(tc, cfg.try_chunk, ch);
                    if (chunk_cost > max_cost[tc])
                        max_cost[tc] = chunk_cost;
                    if (chunk_cost < min_cost[tc] || min_cost[tc] == 0)
                    {
                        min_cost[tc] = chunk_cost;
                        min_cost_ch[tc] = ch;
                    }
                }
            }

            for (int tc = 0; tc < cfg.num_traffic_classes; tc++)
            {
                int dif = max_cost[tc] - min_cost[tc];
                if (min_cost[tc] != 0 && (highest_cost_dif == -1 || dif > highest_cost_dif))
                {
                    lowest_tc = tc;
                    highest_cost_dif = dif;
                }

            }

            if (lowest_tc < 0)
                break;
            lowest_ch = min_cost_ch[lowest_tc];
            heristicNode.AllocateChunk(lowest_tc, cfg.try_chunk, lowest_ch, 0);

            // continue to allocated this option until tc or ch are done
            while (true)
            {
                if (consumed_traffic[lowest_tc] || heristicNode.IsCompleted(lowest_tc))
                {
                    consumed_traffic[lowest_tc] = true;
                    break;
                }
                if (consumed_channels[lowest_ch] || heristicNode.ChFull(lowest_ch))
                {
                    consumed_channels[lowest_ch] = true;
                    break;
                }
                heristicNode.AllocateChunk(lowest_tc, cfg.try_chunk, lowest_ch, 0);
            }

        }

        return heristicNode.SumHeristics();
    }


    int SumHeristics()
    {
        char szDbg[200];
        int heristics = 0;
        szDbg[0] = 0;
        for (unsigned int t = 0; t < cfg.num_traffic_classes; t++)
        {
            int h = tcs[t].CalcHeristics();
            heristics += h;
            if (heristic_debug)
                sprintf(szDbg + strlen(szDbg), "%d.+%d=%d ", t, h,heristics);
            
        }
        if(heristic_debug)
            cfg.WriteDebug("\n%s\n",szDbg);
        return heristics;

    }

    // This is greedy algorithm to clculate initial node
    Node *CalcGreedy()
    {
        // Node greedyNode(*this);
        bool bDone = false;
        // First path find best match for existing bandwidth
        while (!bDone)
        {
            int best_improvement = -1;
            int best_channel = -1;
            int best_tc = -1;
            bDone = true;

            for (unsigned int current_tc = 0; current_tc < cfg.num_traffic_classes; current_tc++)
            {
                int current_improvement = -1;

                if (tcs[current_tc].IsAllAllocated())
                    continue;

                for (int current_channel = 1; current_channel < cfg.num_channels; current_channel++)
                {
                    if (ChFull(current_channel))
                        continue;
                    current_improvement = TryAllocateChunk(current_tc, cfg.try_chunk, 0, current_channel, 0, 0);
                    if (current_improvement > 0 && current_improvement > best_improvement)
                    {
                        best_improvement = current_improvement;
                        best_channel = current_channel;
                        best_tc = current_tc;
                    }
                }
            }


            if (best_channel != -1)
            {
                // found move
                Node nextNode(*this);
                // cfg.WriteDebug("Decending with improvement=%d cost=%d\n", best_improvement, nextNode.GetCost());
                nextNode.AllocateChunk(best_tc, cfg.try_chunk, best_channel, 0);
                nextNode.cost = 0;
                return nextNode.CalcGreedy();
            }
            else
            {
                bDone = true;
            }

        }
        return new Node(*this);

    }



    bool ChFull(int ch)
    {
        int chBw = 0;

        for (unsigned int tc = 0; tc < cfg.num_traffic_classes; tc++)
        {
            chBw += tcs[tc].B(ch);
        }

        return chBw >= cfg.BoC[ch];
    }


    void AllocateChunk(int tc, int chunk, int ch, int fec)
    {
        tcs[tc].AllocateChunk(chunk, ch, fec);
        changed_ch = ch;
        changed_fec = fec;
        changed_tc = tc;
        save_str = "";
        my_hash = 0;
    }

    int TestHeristicChunk(int tc, int chunk, int ch)
    {
        return tcs[tc].TestHeristicChunk(ch, chunk);

    }

    void DeAllocateChunk(int tc, int chunk, int ch, int fec)
    {
        tcs[tc].DeAllocateChunk(chunk, ch, fec);
        changed_ch = ch;
        changed_fec = fec;
        changed_tc = tc;
        save_str = "";
        my_hash = 0;
    }

    // returns cost improvement
    int TryAllocateChunk(int tc, int chunk, int from_ch, int to_ch, int from_fec, int to_fec)
    {
        Node testNode(*this);
        testNode.cost = 0;

        testNode.DeAllocateChunk(tc, chunk, from_ch, from_fec);
        testNode.AllocateChunk(tc, chunk, to_ch, to_fec);
        return GetCost() - testNode.GetCost();
    }

    int GetCost(bool force = false)
    {
        char szDbg[200];

        if (cost && !force)
            return cost;

        cost = 0;
        szDbg[0] = 0;
        for (unsigned int t = 0; t < cfg.num_traffic_classes; t++)
        {
            int tc_cost = tcs[t].CalcCost(force);
            cost += tc_cost;
            sprintf(szDbg + strlen(szDbg), "%d.%d ", t, tc_cost);

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
    uint64_t my_hash;

};


// latency of Traffic
int LC(T t)
{
    int maxL = 0;
    for (unsigned int c = 0; c < cfg.num_channels; c++)
    {
        int l = L(c);
        if (t.B(c))
        {
            if (l > maxL)
                maxL = l;
        }
    }
    return maxL;
}

//  Drop of traffic
int LD(T t)
{
    int totalD = 0;
    int nChannels = 0;
    for (unsigned int c = 0; c < cfg.num_channels; c++)
    {
        int d = D(c);
        if (t.B(c))
        {
            totalD += d;
            nChannels++;
        }
    }
    if (nChannels)
        return totalD / nChannels;
    return totalD;
}


// jitter of traffic
int JC(T t)
{
    int maxL = 0;
    int minL = 0;
    int maxJ = 0;
    for (unsigned int c = 0; c < cfg.num_channels; c++)
    {
        if (t.B(c))
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

    return maxL - minL + maxJ;;
}

std::string Algorithm(RunConfig& _rc)
{
    Init(_rc);

    Node* head = new Node;
    stack<Node*> st;
    st.push(head);
    unsigned int loop = 0;
    Node* pPrintedNode = 0;
    uint64_t stime = Thread::CurrentTimeMsecs();

    Node tryNode = Node(*head);
  
    pMinCostNode = tryNode.CalcGreedy();
    
    
    min_cost = pMinCostNode->GetCost(true);
 
    Node tmpNode(*head);
    heristic_debug = true;
    cfg.WriteDebug("=== head HERISITC NODE ===\n");
    int initial_heristic = tmpNode.CalcHeristic();
    heristic_debug = false;

   

    
    //int greedy_heristic = bestGreedy.CalcHeristic();
    

    cfg.WriteDebug("Greedy cost=%d  head herist=%d\n",
        min_cost,
        //       pMinCostNode->ToStr().c_str()
       
        initial_heristic);

    cfg.WriteDebug("=== GREEDY NODE === \n %s\n", pMinCostNode->ToRepr().c_str());
    



    head->cost = 0;

    while (!st.empty())
    {
        loop++;

        if (loop % 1000 == 0)
        {
            uint64_t runtime = Thread::CurrentTimeMsecs() - stime;
            if (cfg.max_runtime_ms && runtime >= cfg.max_runtime_ms)
            {
                cfg.WriteDebug("Algorithm stopping...reached max runtime %d ms\n", loop, runtime);
                break;
            }

            cfg.WriteDebug("Loop %d Size=%d cost=%d recent=%d leafes=%d visited=%zu ignored=%d pruned=%d runtime:%d ms\n",
                loop, (int)st.size(), min_cost, recent_cost, leafs_reached, visited.size(),
                visited_ignored, pruned, runtime);
            if (pMinCostNode && pMinCostNode != pPrintedNode)
            {
                pPrintedNode = pMinCostNode;
                cfg.WriteDebug("%s\n", pMinCostNode->ToRepr().c_str());
            }
            recent_cost = 0;
        }
        Node* pNext = st.top();
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

    if (pMinCostNode)
    {
        cfg.WriteDebug("Loop %d Size=%d cost=%d recent=%d leafes=%d visited=%zu ignored=%d pruned=%d res=%s\n",
            loop, (int)st.size(), min_cost, recent_cost, leafs_reached, visited_hashes.size(),
            visited_ignored, pruned, pMinCostNode->ToStr().c_str());
        cfg.WriteDebug("%s\n", pMinCostNode->ToRepr().c_str());

        return pMinCostNode->ToReprJson();
    }
    else
    {
        return "{\"res\":\"not found\"}";
    }
}
#if 0
#if !defined(_WIN32)
int main(int, char**)
{
    Algorithm();
    printf("Cost = %d", min_cost);
    return 0;
}
#endif
#endif









