#include "stdio.h"
#include "stdlib.h"
#include "stdbool.h"

#define min(a, b) (((a) < (b)) ? (a) : (b))

typedef struct tagVec2
{
    int X;
    int Y;
} Vec2;

typedef struct tagVec4
{
    int X;
    int Y;
    int Z;
    int W;
} Vec4;

void Swap(Vec2 *a, Vec2 *b)
{
    Vec2 temp = *a;
    *a = *b;
    *b = temp;
}

int Partition(Vec2 arr[], int low, int high)
{
    int pivot = arr[low].Y;
    int i = low;
    int j = high;

    while (i < j)
    {
        while (arr[i].Y <= pivot && i <= high - 1)
        {
            i++;
        }

        while (arr[j].Y > pivot && j >= low + 1)
        {
            j--;
        }

        if (i < j)
        {
            Swap(&arr[i], &arr[j]);
        }
    }
    Swap(&arr[low], &arr[j]);
    return j;
}

void QuickSort(Vec2 *arr, int low, int high)
{
    if (low < high)
    {
        int partitionIndex = Partition(arr, low, high);

        QuickSort(arr, low, partitionIndex - 1);
        QuickSort(arr, partitionIndex + 1, high);
    }
}

double IntersectParabolas(int p, int q)
{
    return (q * q - p * p) / (2 * (q - p));
}

int CalculateLinearDT(
    Vec2 *AllParabolas,
    int NumOfParabolas,
    int W,
    int *Hull,
    double *Intersections,
    int Level)
{
    const int INF = 1000;
    int *VerticesOnCurrentLevel = malloc(W * sizeof(int));
    int NumOfVerticesOnCurrentLevel = 0;
    for (int i = 0; i < NumOfParabolas; i++)
        if (Level == AllParabolas[i].Y)
        {
            VerticesOnCurrentLevel[i] = (AllParabolas[i].X);
            NumOfVerticesOnCurrentLevel++;
        }
    if (NumOfVerticesOnCurrentLevel == 0)
        return 0;
    Intersections[0] = -INF;
    Intersections[1] = INF;
    int k = 0;
    Hull[0] = VerticesOnCurrentLevel[0];
    for (int i = 1; i < NumOfVerticesOnCurrentLevel; i++)
    {
        double s = IntersectParabolas(VerticesOnCurrentLevel[i], VerticesOnCurrentLevel[k]);
        while (s <= Intersections[k])
        {
            k -= 1;
            s = IntersectParabolas(VerticesOnCurrentLevel[i], Hull[k]);
        }
        k += 1;
        Hull[k] = VerticesOnCurrentLevel[i];
        Intersections[k] = s;
        Intersections[k + 1] = INF;
    }
    return k;
}

void MarchParabolas(
    int N,
    int *HullVertices,
    int NumOfHullVertices, double *HullIntersections,
    int *Result)
{
    if (NumOfHullVertices == 0)
        return;
    int k = 0;
    for (int i = 0; i < N; i++)
    {
        while (HullIntersections[k + 1] < i)
            k += 1;
        int dx = i - HullVertices[k];
        Result[i] = dx * dx;
    }
}

int *CreateDF(Vec4 *SrcImage, int W, int H)
{
    Vec2 *AllParabolasVertices = malloc(W * H * sizeof(Vec2));
    int NumberOfAllParabolasVertices = 0;
    for (int x = 0; x < W; x++)
        for (int y = 0; y < H; y++)
        {
            if (SrcImage[y * W + x].X == 0)
            {
                Vec2 v;
                v.X = x, v.Y = y;
                AllParabolasVertices[NumberOfAllParabolasVertices] = v;
                NumberOfAllParabolasVertices++;
            }
        }
    if (NumberOfAllParabolasVertices == 0)
        return NULL;
    QuickSort(AllParabolasVertices, 0, NumberOfAllParabolasVertices);
    int *AllParabolasY = malloc(NumberOfAllParabolasVertices * sizeof(int));
    int NumberOfAllParabolasY = 0;
    for (int i = 0; i < NumberOfAllParabolasVertices; i++)
    {
        bool flag = true;
        for (int j = 0; j < NumberOfAllParabolasY; j++)
        {
            if (AllParabolasY[j] == AllParabolasVertices[i].Y)
                flag = false;
        }
        if (flag)
        {
            AllParabolasY[NumberOfAllParabolasY] = AllParabolasVertices[i].Y;
            NumberOfAllParabolasY++;
        }
    }
    const int INF = 16777216;
    int *ResultImage = malloc(W * H * sizeof(int));
    for (int i = 0; i < W * H; i++)
        ResultImage[i] = INF;
    int **HullVertices = malloc(H * sizeof(int));
    double **HullIntersections = malloc(H * sizeof(double));
    for (int i = 0; i < H; i++)
    {
        int NumberOfHullVertices;
        HullVertices[i] = malloc(W * sizeof(int));
        HullIntersections[i] = malloc(W * sizeof(double));
        NumberOfHullVertices = CalculateLinearDT(
            AllParabolasVertices,
            NumberOfAllParabolasVertices,
            W,
            HullVertices[i],
            HullIntersections[i],
            i);
        if (!NumberOfHullVertices)
            continue;
        MarchParabolas(
            W,
            HullVertices[i],
            NumberOfHullVertices,
            HullIntersections[i], ResultImage + i * H);
    }
    for (int y = 0; y < H; y++)
        for (int x = 0; x < W; x++)
            for (int yi = 0; yi < NumberOfAllParabolasY; yi++)
                ResultImage[y * W + x] = min(
                    ResultImage[y * W + x],
                    (y - yi) * (y - yi) + ResultImage[yi * W + x]);
    return ResultImage;
}

int *CreateSDF(int W, int H, int *Img)
{
    return 0;
}
