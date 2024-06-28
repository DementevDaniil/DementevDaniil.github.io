#include "stdio.h"
#include "stdlib.h"
#include "stdbool.h"
// #include "../emsdk/upstream/emscripten/system/include/emscripten.h"

#define min(a, b) (((a) < (b)) ? (a) : (b))
#define max(a, b) (((a) > (b)) ? (a) : (b))

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

void Sort(Vec2 *A, int N)
{
    Vec2 x;

    for (int i = 1; i < N; i++)
    {
        x = A[i];
        int j = i - 1;
        while (j >= 0 && A[j].Y > x.Y)
            A[j + 1] = A[j], j--;
        A[j + 1] = x;
    }
}

void Swap(Vec2 *A, Vec2 *B)
{
    Vec2 tmp;

    tmp = *A;

    *A = *B;
    *B = tmp;
}

void QuickSort(Vec2 *A, int N)
{
    int e, b;

    Vec2 x = A[N / 2];

    if (N < 2)
        return;

    b = 0;
    e = N - 1;
    while (b <= e)
    {
        while (A[b].Y < x.Y)
            b++;
        while (A[e].Y > x.Y)
            e--;
        if (b <= e)
        {
            if (b != e)
                Swap(&A[b], &A[e]);
            b++;
            e--;
        }
    }
    QuickSort(A, e + 1);
    QuickSort(A + b, N - b);
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
            VerticesOnCurrentLevel[NumOfVerticesOnCurrentLevel] = (AllParabolas[i].X);
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
    free(VerticesOnCurrentLevel);
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
                AllParabolasVertices[NumberOfAllParabolasVertices].X = x;
                AllParabolasVertices[NumberOfAllParabolasVertices++].Y = y;
            }
        }
    if (NumberOfAllParabolasVertices == 0)
        return NULL;
    QuickSort(AllParabolasVertices, NumberOfAllParabolasVertices);
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
            AllParabolasY[NumberOfAllParabolasY++] = AllParabolasVertices[i].Y;
        }
    }

    const int INF = 16777216;
    int *ResultImage = malloc(W * H * sizeof(int));
    int *Linears = malloc(W * H * sizeof(int));
    for (int i = 0; i < W * H; i++)
        ResultImage[i] = Linears[i] = INF;
    int *HullVertices = malloc(W * sizeof(int));
    double *HullIntersections = malloc(W * sizeof(double));
    for (int i = 0; i < H; i++)
    {
        int NumberOfHullVertices;
        NumberOfHullVertices = CalculateLinearDT(
            AllParabolasVertices,
            NumberOfAllParabolasVertices,
            W,
            HullVertices,
            HullIntersections,
            i);
        if (!NumberOfHullVertices)
            continue;
        MarchParabolas(
            W,
            HullVertices,
            NumberOfHullVertices,
            HullIntersections, Linears + i * W);
    }
    for (int y = 0; y < H; y++)
    {
        for (int x = 0; x < W; x++)
        {
            for (int yi = 0; yi < NumberOfAllParabolasY; yi++)
                ResultImage[y * W + x] = min(
                    ResultImage[y * W + x],
                    (y - AllParabolasY[yi]) * (y - AllParabolasY[yi]) + Linears[AllParabolasY[yi] * W + x]);
        }
    }

    free(AllParabolasVertices);
    free(AllParabolasY);
    free(HullVertices);
    free(HullIntersections);
    free(Linears);

    return ResultImage;
}

void CreateSDF(int W, int H, int *Img, int *ResultImage)
{
    Vec4 *SrcImage = (Vec4 *)Img;
    int *df1 = CreateDF(SrcImage, W, H);
    if (!df1)
        return;
    Vec4 *InvertedImage = malloc(sizeof(Vec4) * W * H);
    for (int y = 0; y < H; y++)
    {
        for (int x = 0; x < W; x++)
        {
            InvertedImage[y * W + x].X = 255 - SrcImage[y * W + x].X;
            InvertedImage[y * W + x].Y = 255 - SrcImage[y * W + x].Y;
            InvertedImage[y * W + x].Z = 255 - SrcImage[y * W + x].Z;
            InvertedImage[y * W + x].W = 255;
        }
    }
    int *df2 = CreateDF(InvertedImage, W, H);
    if (!df2)
        return;
    for (int i = 0; i < H; i++)
    {
        for (int j = 0; j < W; j++)
        {
            int a = df1[i * W + j] - df2[i * W + j];
            if (a < -1)
                ResultImage[i * W + j] = 0;
            else if (a == -1)
                ResultImage[i * W + j] = 128;
            else
                ResultImage[i * W + j] = min(a + 128, 255);
        }
    }
    free(df1);
    free(df2);
    free(InvertedImage);
}
