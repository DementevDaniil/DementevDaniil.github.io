#version 300 es
precision highp float;
in vec4 in_pos;
out vec4 color;

void main()
{
    gl_Position = in_pos;
    color = vec4(1, 1, 0, 1);
}
