import React, { useState } from 'react';

import { abs, sqrt, min, Vec2, Vec4 } from './mth';

function IntersectParabolas(p: number, q: number) {
    return (q * q - p * p) / (2 * (q - p));
}

function calculateLinearDT(
    allParabolas: Vec2[],
    hull: number[],
    intersections: number[],
    level: number
) {
    const INF = 1000;
    let vertices = [];
    for (let i = 0; i < allParabolas.length; i++)
        if (level == allParabolas[i].y) {
            vertices.push(allParabolas[i].x);
        }
    if (vertices.length == 0) return false;
    intersections[0] = -INF;
    intersections[1] = INF;
    let k = 0;
    hull[0] = vertices[0];
    for (let i = 1; i < vertices.length; i++) {
        let s = IntersectParabolas(vertices[i], vertices[k]);
        while (s <= intersections[k]) {
            k -= 1;
            s = IntersectParabolas(vertices[i], hull[k]);
        }
        k += 1;
        hull[k] = vertices[i];
        intersections[k] = s;
        intersections[k + 1] = INF;
    }
    return true;
}

function MarchParabolas(
    n: number,
    hullVertices: number[],
    hullIntersections: number[]
) {
    if (hullVertices.length == 0) return;
    let d = [];
    let k = 0;
    for (let i = 0; i < n; i++) {
        while (hullIntersections[k + 1] < i) k += 1;
        let dx = i - hullVertices[k];
        d.push(dx * dx);
    }
    return d;
}

function CreateDF(srcImage: Vec4[][], width: number, height: number) {
    let allParabolasVertices = [];
    for (let x = 0; x < width; x++)
        for (let y = 0; y < height; y++) {
            if (srcImage[y][x].x == 0) {
                allParabolasVertices.push(new Vec2(x, y));
            }
        }
    if (allParabolasVertices.length == 0) return;
    allParabolasVertices.sort((a: Vec2, b: Vec2) => {
        return a.y - b.y;
    });
    let allParabolasY = new Set<number>();
    for (let i = 0; i < allParabolasVertices.length; i++)
        allParabolasY.add(allParabolasVertices[i].y);
    const INF = 16777216;
    let resultImage = new Array(height);
    for (let i = 0; i < height; i++) {
        resultImage[i] = new Array(width);
        resultImage[i].fill(INF);
    }
    let hullVertices = new Array(height);
    let hullIntersections = new Array(height);
    for (let i = 0; i < height; i++) {
        hullVertices[i] = new Array(width);
        hullIntersections[i] = new Array(width);
        if (
            !calculateLinearDT(
                allParabolasVertices,
                hullVertices[i],
                hullIntersections[i],
                i
            )
        )
            continue;
        resultImage[i] = MarchParabolas(
            width,
            hullVertices[i],
            hullIntersections[i]
        );
    }
    for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++)
            for (let yi of allParabolasY)
                resultImage[y][x] = min(
                    resultImage[y][x],
                    (y - yi) * (y - yi) + resultImage[yi][x]
                );
    return resultImage;
}

export function CreateSDF(width: number, height: number, srcImage: Vec4[][]) {
    let df1 = CreateDF(srcImage, width, height);
    if (!df1) return;
    let invertedImage = new Array(height);
    for (let y = 0; y < height; y++) {
        invertedImage[y] = new Array(width);
        for (let x = 0; x < width; x++) {
            invertedImage[y][x] = new Vec4(
                255 - srcImage[y][x].x,
                255 - srcImage[y][x].y,
                255 - srcImage[y][x].z,
                srcImage[y][x].w
            );
        }
    }
    let df2 = CreateDF(invertedImage, width, height);
    if (!df2) return;
    let helperImage = new Array(height);
    let sdf = new Array(height);
    for (let i = 0; i < height; i++) {
        helperImage[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            let a = df1[i][j] - df2[i][j];
            if (a < -1) helperImage[i][j] = 0;
            else if (a == -1) helperImage[i][j] = 128;
            else helperImage[i][j] = 5 * a + 128;
        }
    }
    let resultImage = new Array(height);
    for (let i = 0; i < height; i++) {
        resultImage[i] = new Array(width);
        for (let j = 0; j < width; j++) {
            // if (i == 0 || j == 0) resultImage[i][j] = helperImage[i][j];
            // else resultImage[i][j] = helperImage[i-1][j-1]+
            resultImage[i][j] = helperImage[i][j];
        }
    }
    return resultImage;
}
