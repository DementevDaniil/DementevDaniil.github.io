#version 300 es
precision highp float;

struct Material {
    vec4 Type;
    vec4 AmbRef;
    vec4 DiffTrans;
    vec4 SpecPh;
};

struct ShapesData {
    Material Mtl;
    vec4 AddData[3];
};

struct MapResult {
    float Dist;
    int Index;
};

struct Intersection {
    int IsIntersected;
    vec3 Point;
    vec3 Normal;
    MapResult Result;
};

layout(std140) uniform Camera
{
    vec4 camera_position_frame_w;
    vec4 rotate_angles_frame_h;
};

layout(std140) uniform ShapesBuffer
{
    vec4 NumOfShapes;
    ShapesData AllShapes[64];
};

#define cameraPosition camera_position_frame_w.xyz
#define frameW camera_position_frame_w.w
#define rotateY rotate_angles_frame_h.y
#define frameH rotate_angles_frame_h.w

const int NUMBER_OF_STEPS = 512;
const float MINIMUM_HIT_DISTANCE = 0.001;
const float MAXIMUM_TRACE_DISTANCE = 10000.0;

out vec4 o_color;

const float PI = 3.14;

mat3 matr_rotate_y(float a)
{
    a = a / 180.0 * PI;
    float c = cos(a), s = sin(a);

    mat3 res;
    res[0][0] = c;
    res[1][1] = 1.0;
    res[0][2] = -s;
    res[2][0] = s;
    res[2][2] = c;

    return res;
}

float DistanceFromSphere(vec3 point, vec3 center, float radius)
{
    return length(point - center) - radius;
}

float DistanceFromPlane(vec3 point, vec3 center, vec3 normal)
{
    vec3 d = point - center;
    return length(d) * abs(dot(normalize(d), normal));
}

MapResult map_the_world(vec3 p)
{
    MapResult res;
    res.Dist = MAXIMUM_TRACE_DISTANCE;
    res.Index = -1;
    for (int i = 0; i < int(NumOfShapes.x); i++) {
        if (AllShapes[i].Mtl.Type.x == 1.0) {
            float newd = DistanceFromSphere(p, AllShapes[i].AddData[0].xyz, AllShapes[i].AddData[0].w);
            if (newd < res.Dist) {
                res.Dist = newd;
                res.Index = i;
            }
        } else if (AllShapes[i].Mtl.Type.x == 2.0) {
            float newd = DistanceFromPlane(p, AllShapes[i].AddData[0].xyz, AllShapes[i].AddData[1].xyz);
            if (newd < res.Dist) {
                res.Dist = newd;
                res.Index = i;
            }
        }
    }
    return res;
}

// float map_the_world(in vec3 p)
// {
//     float displacement = sin(5.0 * p.x) * sin(5.0 * p.y) * sin(5.0 * p.z) * 0.25;
//     float sphere_0 = distance_from_sphere(p, vec3(0.0), 1.0);

//     return sphere_0 + displacement;
//  }

vec3 calculate_normal(vec3 p)
{
    const vec3 small_step = vec3(0.001, 0.0, 0.0);

    float gradient_x = map_the_world(p + small_step.xyy).Dist - map_the_world(p - small_step.xyy).Dist;
    float gradient_y = map_the_world(p + small_step.yxy).Dist - map_the_world(p - small_step.yxy).Dist;
    float gradient_z = map_the_world(p + small_step.yyx).Dist - map_the_world(p - small_step.yyx).Dist;

    vec3 normal = vec3(gradient_x, gradient_y, gradient_z);

    return normalize(normal);
}

int MAX_REC_DEPTH = 3;

// Light data
vec3 LightPosition = normalize(vec3(2.0, 11.0, 3.0));
vec3 LightColor = vec3(1);

vec3 Shade(vec3 p, vec3 n, Material Mtl) {
    vec3 v = normalize(p - cameraPosition);
    n = faceforward(n, v, n);
    vec3 LightDirection = normalize(LightPosition - p);

    vec3 kd = Mtl.DiffTrans.xyz;
    if (Mtl.Type.y == 1.0)
        if (((int(p.x) ^ int(p.y + 0.02) ^ int(p.z)) & 1) == 1)
            kd *= 0.14;
    vec3 color = Mtl.AmbRef.xyz;
    color += max(0.0, dot(n, LightDirection)) * kd * LightColor; 
    vec3 r = reflect(v, n);
    color += pow(max(0.0, dot(r, LightDirection)), Mtl.SpecPh.w) * Mtl.SpecPh.xyz * LightColor;
    return color;
}

Intersection ray_march(vec3 ro, vec3 rd)
{
    float total_distance_traveled = 0.0;

    Intersection Intr;
    Intr.IsIntersected = 0;
    for (int i = 0; i < NUMBER_OF_STEPS; ++i)
    {
        vec3 current_position = ro + total_distance_traveled * rd;

        MapResult result = map_the_world(current_position);

        if (result.Dist < MINIMUM_HIT_DISTANCE) 
        {
            vec3 normal = calculate_normal(current_position);

            Intr.IsIntersected = 1;
            Intr.Normal = normal;
            Intr.Point = current_position;
            Intr.Result = result;

            return Intr;
        }

        if (total_distance_traveled > MAXIMUM_TRACE_DISTANCE)
        {
            break;
        }
        total_distance_traveled += result.Dist;
    }
    return Intr;
}

void main()
{
    // vec2 uv = vUV.st * 2.0 - 1.0;
    vec2 uv = vec2(-1.0, -1.0) + 2.0 * gl_FragCoord.xy / max(frameW, frameH);
    vec3 ro = cameraPosition;
    vec3 rd = vec3(uv, 1.0);
    rd = matr_rotate_y(rotateY) * rd;
    rd = normalize(rd);

    vec3 FogColor = vec3(0.1, 0.3, 0.7);
    float MaxVisibilityDist = 30.0;

    vec3 ResColor = vec3(0);
    vec3 CurOrg = ro, CurDir = rd;
    for (int rec_depth = 0; rec_depth < MAX_REC_DEPTH; rec_depth++) {
        Intersection Intr = ray_march(CurOrg, CurDir);
        if (Intr.IsIntersected == 0) break;
        ResColor += Shade(Intr.Point, Intr.Normal, AllShapes[Intr.Result.Index].Mtl) *
            FogColor * max(0.0, MaxVisibilityDist - Intr.Result.Dist) / MaxVisibilityDist;
        ResColor = clamp(ResColor, 0.0, 1.0);
        CurDir = reflect(CurDir, Intr.Normal);
        CurOrg = Intr.Point + CurDir * 0.001;
    }

    o_color = vec4(ResColor, 1.0);
}
