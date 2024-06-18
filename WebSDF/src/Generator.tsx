import React, { useState } from 'react';

import { abs, sqrt, min, Vec2 } from './mth';

function IntersectParabolas(p: Vec2, q: Vec2) {
    return (q.y + q.x * q.x - (p.y + p.x * p.x)) / (2 * q.x - 2 * p.x);
}

function calculateLinearDT(
    allParabolas: Vec2[],
    hullVertices: Vec2[],
    hullIntersections: number[],
    level: number
) {
    const INF = 1000;
    if (allParabolas.length == 0) return;
    allParabolas.sort((a: Vec2, b: Vec2) => {
        return a.x - b.x;
    });
    hullVertices.push(
        new Vec2(allParabolas[0].x, abs(allParabolas[0].y - level))
    );
    hullIntersections[0] = -INF;
    hullIntersections[1] = INF;
    let k = 0;
    for (let i = 1; i < allParabolas.length; i++) {
        let q = new Vec2(allParabolas[i].x, allParabolas[i].y);
        q.y = abs(q.y - level);
        let p = new Vec2(hullVertices[k].x, hullVertices[k].y);
        let s = -INF;
        let flag = true;
        while (true) {
            if (q.x == p.x) {
                if (p.y < q.y) {
                    s = INF;
                    flag = false;
                    break;
                } else {
                    k -= 1;
                    if (k == -1) break;
                    p = new Vec2(hullVertices[k].x, hullVertices[k].y);
                }
            } else {
                s = IntersectParabolas(p, q);
                if (s > hullIntersections[k]) break;
                k -= 1;
                p = new Vec2(hullVertices[k].x, hullVertices[k].y);
            }
        }
        if (flag) {
            k += 1;
            hullVertices[k] = new Vec2(q.x, q.y);
            hullIntersections[k] = s;
            hullIntersections[k + 1] = INF;
        }
    }
}

function MarchParabolas(
    n: number,
    hullVertices: Vec2[],
    hullIntersections: number[]
) {
    let d = [];
    let k = 0;
    for (let i = 0; i < n; i++) {
        while (hullIntersections[k + 1] < i) k += 1;
        let dx = i - hullVertices[k].x;
        d.push(abs(dx * dx + hullVertices[k].y));
    }
    return d;
}

export function CreateSDF(width: number, height: number, srcImage: number[][]) {
    // let allParabolasVertices = [];
    // for (let x = 0; x < width; x++)
    //     for (let y = 0; y < height; y++) {
    //         if (srcImage[y][x] == 0) {
    //             allParabolasVertices.push(new Vec2(x, height - y - 1));
    //         }
    //     }
    // console.log(srcImage);
    // let hullVertices: Vec2[][];
    // let hullIntersections: number[][];

    // let linears = [];
    // hullVertices = new Array(height);
    // hullIntersections = new Array(height);
    // for (let i = 0; i < height; i++) {
    //     hullVertices[i] = new Array();
    //     hullIntersections[i] = new Array();
    //     calculateLinearDT(
    //         allParabolasVertices,
    //         hullVertices[i],
    //         hullIntersections[i],
    //         height - i - 1
    //     );
    //     console.log(hullVertices[i]);
    //     linears[i] = MarchParabolas(
    //         width,
    //         hullVertices[i],
    //         hullIntersections[i]
    //     );
    //     console.log(linears[i]);
    // }
    // const INF = 16777216;
    // let resultImage = new Array(height);
    // for (let i = 0; i < height; i++) {
    //     resultImage[i] = new Array(width);
    //     // for (let j = 0; j < width; j++) {
    //     //     resultImage[i][j] = linears[i][j];
    //     // }
    //     resultImage[i].fill(INF);
    // }
    // for (let y = 0; y < height; y++)
    //     for (let x = 0; x < width; x++)
    //         for (let i of allParabolasVertices)
    //             for (let xi = 0; xi < linears[i.y].length; xi++) {
    //                 resultImage[y][x] = min(
    //                     resultImage[y][x],
    //                     (y - i.y) * (y - i.y) + linears[i.y][xi]
    //                 );
    //             }
    // calculateLinearDT(allParabolasVertices, hullVertices, hullIntersections);
    // console.log(hullVertices);
    // console.log(hullIntersections);
    // let xResult = MarchParabolas(width, hullVertices, hullIntersections, 0);
    // console.log(xResult);

    // let rotImage = new Array(width);
    // for (let i = 0; i < width; i++) {
    //     rotImage[i] = new Array(height);
    // }
    // for (let x = 0; x < width; x++)
    //     for (let y = 0; y < height; y++) {
    //         rotImage[width - x - 1][y] = srcImage[y][x];
    //     }
    // allParabolasVertices = [];
    // for (let x = 0; x < height; x++)
    //     for (let y = 0; y < width; y++) {
    //         if (rotImage[y][x] == 0) {
    //             allParabolasVertices.push(new Vec2(x, y));
    //         }
    //     }
    // console.log(rotImage);
    // hullVertices = [];
    // hullIntersections = [];
    // calculateLinearDT(allParabolasVertices, hullVertices, hullIntersections);
    // console.log(hullVertices);
    // console.log(hullIntersections);
    // let yResult = MarchParabolas(height, hullVertices, hullIntersections);

    // let resultImage = new Array(height);
    // for (let i = 0; i < height; i++) {
    //     resultImage[i] = new Array(width);
    // }
    // for (let x = 0; x < width; x++)
    //     for (let y = 0; y < height; y++) {
    //         resultImage[y][x] = xResult[x] + yResult[y];
    //     }
    // console.log(yResult);
    const INF = 16777216;
    let resultImage = new Array(height);
    for (let i = 0; i < height; i++) {
        resultImage[i] = new Array(width);
        resultImage[i].fill(INF);
    }
    for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++)
            for (let yi = 0; yi < height; yi++)
                for (let xi = 0; xi < width; xi++) {
                    if (srcImage[yi][xi] == 0)
                        resultImage[y][x] = min(
                            resultImage[y][x],
                            (y - yi) * (y - yi) + (x - xi) * (x - xi)
                        );
                }
    return resultImage;
}
